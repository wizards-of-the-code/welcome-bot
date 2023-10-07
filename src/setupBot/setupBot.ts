import { Telegraf } from 'telegraf';
import { Bot, BotContext } from '../contracts';
import config from '../config/ConfigService';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';
import LocalSession from 'telegraf-session-local';
import { setBotDescription } from './setBotDescription';

const setupBot = (() => {
  let bot: Bot | null = null;
  return (): Bot => {
    if (bot) {
      return bot;
    }

    logger.info('Set-upping bot');
    bot = new Telegraf<BotContext>(config.get('BOT_TOKEN'));
    bot.catch((e) => {
      logger.error(getErrorMsg(e));
    });

    setBotDescription(bot);

    bot.use(
      new LocalSession({
        database: `sessions/sessions.json`,
      }).middleware(),
    );
    logger.info('Bot is launched');
    bot.launch({ dropPendingUpdates: true });

    // Enable graceful stop
    process.once('SIGINT', () => bot?.stop('SIGINT'));
    process.once('SIGTERM', () => bot?.stop('SIGTERM'));
    return bot;
  };
})();

const getBot = (): Bot => {
  return setupBot();
};

export default getBot;
