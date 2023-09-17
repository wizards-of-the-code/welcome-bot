import { message } from 'telegraf/filters';
import { Bot } from '../../contracts';

/**
 * @param {TelegramBot} bot;
 */
const onLeftChatMember = (bot: Bot) => {
  bot.on(message('left_chat_member'), async (ctx) => {
    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (e) {
      console.error(e);
    }
  });
};

export default onLeftChatMember;
