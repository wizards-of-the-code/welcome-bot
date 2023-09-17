import { Bot } from '../../contracts';
import { message } from 'telegraf/filters';
import { escapeTextForMarkdown2, getErrorMsg } from '../helpers/helpers';

/**
 * @param bot
 */
const onNewMessage = (bot: Bot) => {
  bot.on(message('text'), async (ctx) => {
    try {
      const user = ctx.message.from;
      const newMemberMention = `[@${escapeTextForMarkdown2(
        user.username ?? user.first_name,
      )}](tg://user?id=${user.id})`;

      await ctx.sendMessage(`${newMemberMention} \n\nHello there`, {
        parse_mode: 'MarkdownV2',
      });
    } catch (e) {
      console.error(getErrorMsg(e));
    }
  });
};
export default onNewMessage;
