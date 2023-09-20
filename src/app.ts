import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import { Telegraf } from 'telegraf';
import { getErrorMsg } from './listeners/helpers/helpers';
import config from './config/ConfigService';
import logger from './logger/logger';
import setupCommands from "./commands/setupCommands";

const main = async () => {
  await connectToMongoose();
  const bot = new Telegraf(config.get('BOT_TOKEN'));
  setupListeners(bot);

  await setupCommands(bot);
  bot.launch();
  logger.info('Bot is launched');

  bot.catch((e) => {
    logger.error(getErrorMsg(e));
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

main();
