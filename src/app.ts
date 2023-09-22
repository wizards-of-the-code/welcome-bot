import LocalSession from 'telegraf-session-local';
import { Telegraf } from 'telegraf';
import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import config from './config/ConfigService';
import logger from './logger/logger';
import setupCommands from './commands/setupCommands';
import { getErrorMsg } from './listeners/helpers/helpers';
import { BotContext } from './contracts';
import { setupActions } from './actions/setupActions';

const main = async () => {
  await connectToMongoose();
  const bot = new Telegraf<BotContext>(config.get('BOT_TOKEN'));
  bot.catch((e) => {
    logger.error(getErrorMsg(e));
  });

  bot.use(
    new LocalSession({
      database: `sessions/sessions.json`,
    }).middleware(),
  );

  await setupCommands(bot);
  setupActions(bot);
  setupListeners(bot);

  logger.info('Bot is launched');
  bot.launch({ dropPendingUpdates: true });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
main();
