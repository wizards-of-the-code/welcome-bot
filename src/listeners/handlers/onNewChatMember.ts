import { message } from 'telegraf/filters';
import logger from '../../logger/logger';
import { getErrorMsg } from '../helpers/helpers';
import { getChatSettingsWithFooter } from '../helpers/dbRequests';
import { Bot } from '../../contracts';
import { generateDigitCaptchaTask } from '../../helpers/captcha';
import { deleteMessage } from '../../helpers/helpers';


export const onNewChatMember = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    const { chat } = ctx;
    const chatSettings = await getChatSettingsWithFooter(chat.id);
    const newMembers = ctx.message.new_chat_members;
    const newMember = newMembers[0];

    if (!chatSettings || !chatSettings?.botEnabled || ctx.from.id === ctx.botInfo.id /*newMember.is_bot*/) return;

    ctx.session.counter = 0;
    await generateDigitCaptchaTask({ ctx, session: ctx.session, user: newMember });

    ctx.session.welcome = {
      welcomeMessage: chatSettings.message,
      footer: chatSettings.footer.message,
      previousSentMessage: chatSettings.previousSentMessage,
    };
    ctx.session.newChatMember = newMember;
    newMember.username;

    try {
      // Deletes message that says that user has joined the chat
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (e) {
      logger.error(getErrorMsg(e));
    }

    if (chatSettings.previousSentMessage?.messageId && chatSettings.previousSentMessage?.chatId) {
      await deleteMessage(
        ctx,
        chatSettings.previousSentMessage.chatId,
        chatSettings.previousSentMessage.messageId,
      );
    }
  });
};
