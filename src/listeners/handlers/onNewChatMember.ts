import { message } from 'telegraf/filters';
import { getChatSettingsWithFooter } from '../helpers/dbRequests';
import { Bot } from '../../contracts';
import { sendCaptcha } from '../../captcha/captcha';
import { deleteMessage } from '../../helpers/helpers';
import { welcomeNewMember } from '../../middlewares/welcomeNewMember';
import { formSessionOnNewChatMember } from '../helpers/helpers';
import { CaptchaEnum } from '../../schemas/types';

export const onNewChatMember = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    const { chat } = ctx;
    const chatSettings = await getChatSettingsWithFooter(chat.id);
    const newMember = ctx.message.new_chat_members[0];

    if (!chatSettings || !chatSettings?.botEnabled || newMember.id === ctx.botInfo.id) {
      return;
    }
    // Deletes message that says that user has joined the chat
    await ctx.deleteMessage(ctx.message.message_id);

    formSessionOnNewChatMember({ chatSettings, newMember, session: ctx.session });

    if (chatSettings.captcha && chatSettings.captcha !== CaptchaEnum.NONE) {
      await sendCaptcha({
        ctx,
        user: newMember,
      });
    } else {
      await welcomeNewMember(ctx);
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
