import { BotContext } from '../../contracts';
import { ChatSettings } from '../../schemas/models';
import logger from '../../logger/logger';
import { setupChatSettings } from '../helpers/dbRequests';
import { getErrorMsg } from '../../listeners/helpers/helpers';

const setupGroup = async (ctx: BotContext) => {
  const { chat, from } = ctx;
  if (!chat || !from || !('title' in chat) || !ctx.message) return;

  const chatSettings = await ChatSettings.findOne({ chatId: chat.id });

  if (chatSettings?.botEnabled) return;

  const admins = await ctx.getChatAdministrators();
  const adminsIDs = admins.map((admin) => admin.user.id);
  const creator = admins.find((admin) => admin.status === 'creator');

  if (!creator || !creator.user.username || from.username !== creator.user.username) {
    return;
  }

  if (!chatSettings) {
    logger.info(`Bot is setup && enabled for ${chat.title}`);
    await setupChatSettings({
      chatTitle: chat.title,
      chatId: chat.id,
      chatType: chat.type,
      administrators: adminsIDs,
      botEnabled: true,
      creator: { id: creator.user.id, username: creator.user.username },
    });
  } else if (chatSettings) {
    logger.info(`Bot is enabled chat ${chatSettings.chatTitle}`);
    await chatSettings.updateOne({ chatId: chat.id }, { botEnabled: true });
  }
  try {
    await ctx.deleteMessage(ctx.message.message_id);
    await ctx.reply('Bot is activated');
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};

export default setupGroup;
