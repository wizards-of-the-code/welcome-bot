import { message } from 'telegraf/filters';
import logger from '../../logger/logger';
import { getErrorMsg } from '../helpers/helpers';
import { getChatSettingsWithFooter } from '../helpers/dbRequests';
import { Bot } from '../../contracts';
import { generateCaptchaTask } from '../../helpers/captcha';

const allowedTaskTime = 60; //sec

export const onNewChatMember = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    const { chat } = ctx;
    const chatSettings = await getChatSettingsWithFooter(chat.id);
    const newMembers = ctx.message.new_chat_members;
    const newMember = ctx.message.new_chat_members[0];

    if (!chatSettings || !chatSettings?.botEnabled || newMember.is_bot) return;

    await generateCaptchaTask(ctx, allowedTaskTime);

    ctx.session.welcome = {
      welcomeMessage: chatSettings.message,
      footer: chatSettings.footer.message,
      previousSentMessage: chatSettings.previousSentMessage,
    };
    ctx.session.newChatMembers = newMembers;

    try {
      // Deletes message that says that user has joined the chat
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (e) {
      logger.error(getErrorMsg(e));
    }

    if (chatSettings.previousSentMessage?.messageId && chatSettings.previousSentMessage?.chatId) {
      try {
        await ctx.telegram.deleteMessage(
          chatSettings.previousSentMessage.chatId,
          chatSettings.previousSentMessage.messageId,
        );
      } catch (e) {
        logger.error(getErrorMsg(e));
      }
    }
  });
};
