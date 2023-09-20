import { message } from 'telegraf/filters';
import { Bot } from '../../contracts';
import logger from '../../logger/logger';
import { getErrorMsg } from '../helpers/helpers';

/**
 * @param {TelegramBot} bot;
 */
const onLeftChatMember = (bot: Bot) => {
  bot.on(message('left_chat_member'), async (ctx) => {
    logger.info('Handle "left_chat_member" event');
    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (e) {
      logger.error(`While deleting message of event - "left_chat_member" - ${getErrorMsg(e)}`);
    }
  });
};

export default onLeftChatMember;
