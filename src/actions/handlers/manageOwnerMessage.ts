import { ChatSettings, OwnerMessage } from '../../schemas/models';
import { Bot } from '../../contracts';
import { ManageOwnerMessage } from '../../commands/handlers/manageOwnerMessage';
import configService from '../../config/ConfigService';

export const getChatsWhereBotEnabled = async () => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true })
    .select('chatId')
    .lean();

  return chatSettings.map((chat) => chat.chatId);
};

/**
 * Sends owner message to all chats where bot is enabled
 * @param bot
 */
export const sendOwnerMessage = (bot: Bot) => {
  bot.action(ManageOwnerMessage.SEND, async (ctx, next) => {
    await ctx.deleteMessage();
    const message = await OwnerMessage.findOne({
      ownerUsername: configService.get('OWNER_USERNAME'),
    })
      .select('message')
      .lean();

    const chats = await getChatsWhereBotEnabled();
    await Promise.all(
      chats.map((chatId) => bot.telegram.sendMessage(chatId, message?.message as string)),
    );
    await next();
  });
};

/**
 * Sends owner message to all chats where bot is enabled & pins the message
 * @param bot
 */
export const pinOwnerMessage = (bot: Bot) => {
  bot.action(ManageOwnerMessage.PIN, async (ctx, next) => {
    ctx.deleteMessage();
    const message = await OwnerMessage.findOne({
      ownerUsername: configService.get('OWNER_USERNAME'),
    })
      .select('message')
      .lean();

    const chats = await getChatsWhereBotEnabled();
    await Promise.all(
      chats.map((chatId) =>
        bot.telegram
          .sendMessage(chatId, message?.message as string)
          .then((sentMessage) => bot.telegram.pinChatMessage(chatId, sentMessage.message_id)),
      ),
    );
    await next();
  });
};
