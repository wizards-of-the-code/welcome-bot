import { Bot } from '../../contracts';
import { message } from 'telegraf/filters';
import { getErrorMsg } from '../helpers/helpers';
import logger from '../../logger/logger';
import { collectTags } from '../../analytics/collectProfiles';

/**
 * @param bot
 */
const onNewMessage = (bot: Bot) => {
  bot.on(message('text'), async (ctx) => {
    try {
      await collectTags(ctx);
    } catch (e) {
      logger.error(getErrorMsg(e));
    }
  });
};
export default onNewMessage;
