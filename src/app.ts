import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import { Telegraf } from 'telegraf';
import { getErrorMsg } from './listeners/helpers/helpers';
import config from './config/ConfigService';
import logger from './logger/logger';

const main = async () => {
  await connectToMongoose();
  const bot = new Telegraf(config.get('BOT_TOKEN'));
  setupListeners(bot);

  bot.launch();
  logger.info('Bot is launched');

  bot.catch((e) => {
    logger.error(getErrorMsg(e))
  });
};

main();
