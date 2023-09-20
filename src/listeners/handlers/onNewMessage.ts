import { Bot } from '../../contracts';
import { message } from 'telegraf/filters';
import { escapeForMarkdown2, getErrorMsg, customMention } from '../helpers/helpers';
import logger from '../../logger/logger';
import { ChatSettings } from '../../schemas/models';

/**
 * @param bot
 */
const onNewMessage = (bot: Bot) => {
  bot.on(message('text'), async (ctx) => {
    try {
      if (ctx && 'title' in ctx.chat) {
        const { chat } = ctx;

        const chatSettings = await ChatSettings.findOne({ chatTitle: 'Test bot 2' }).lean();
        logger.info(chatSettings?.message);

        const user = ctx.message.from;
        const newMemberMention = customMention(
          escapeForMarkdown2(user.username ?? user.first_name),
          user.id,
        );

        const msg = `${chatSettings?.message || 'Hi'}`;

        await ctx.sendMessage(msg, {
          // parse_mode: 'MarkdownV2',
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      }
    } catch (e) {
      logger.error(getErrorMsg(e));
    }
  });
};
export default onNewMessage;
