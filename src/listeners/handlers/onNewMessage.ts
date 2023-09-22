import { message } from 'telegraf/filters';
import { Bot } from '../../contracts';
import { getErrorMsg } from '../helpers/helpers';
import logger from '../../logger/logger';
import { collectTags } from '../../analytics/collectTags';
import { onOwnerMessage } from './onOwnerMessage';

/**
 * @param bot
 */
const onNewMessage = (bot: Bot) => {
  bot.on(message('text'), async (ctx, next) => {
    try {
      await collectTags(ctx);
      await onOwnerMessage(ctx);
      await next();
    } catch (e) {
      logger.error(getErrorMsg(e));
    }
  });
};
export default onNewMessage;
