import { message } from 'telegraf/filters';
import { Bot } from '../../contracts';

/**
 * @param {TelegramBot} bot;
 */
const onLeftChatMember = (bot: Bot) => {
  bot.on(message('left_chat_member'), (ctx) => {
    ctx.deleteMessage(ctx.message.message_id);
  });
};

export default onLeftChatMember;
