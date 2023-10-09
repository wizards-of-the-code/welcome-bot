import { message } from 'telegraf/filters';
import { getChatSettingsWithFooter } from '../helpers/dbRequests';
import { Bot } from '../../contracts';
import { generateCaptchaTask } from '../../helpers/captcha';
import { deleteMessage } from '../../helpers/helpers';
import { welcomeNewMember } from '../../middlewares/welcomeNewMember';
import { formSessionOnNewChatMember } from '../helpers/helpers';

export const onNewChatMember = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    const { chat } = ctx;
    const chatSettings = await getChatSettingsWithFooter(chat.id);
    const newMember = ctx.message.new_chat_members[0];

    if (!chatSettings || !chatSettings?.botEnabled || newMember.id === ctx.botInfo.id) {
      return;
    }
    formSessionOnNewChatMember({ chatSettings, newMember, session: ctx.session });

    if (chatSettings.captcha) {
      await generateCaptchaTask({
        ctx,
        user: newMember,
      });
    } else {
      await welcomeNewMember(ctx);
    }

    // Deletes message that says that user has joined the chat
    await ctx.deleteMessage(ctx.message.message_id);

    if (chatSettings.previousSentMessage?.messageId && chatSettings.previousSentMessage?.chatId) {
      await deleteMessage(
        ctx,
        chatSettings.previousSentMessage.chatId,
        chatSettings.previousSentMessage.messageId,
      );
    }
  });
};
