import ConfigService from './config/ConfigService';
import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import { Telegraf } from 'telegraf';
import { getErrorMsg } from './listeners/helpers/helpers';

const main = async () => {
  const config = new ConfigService();

  await connectToMongoose(config);
  const bot = new Telegraf(config.get('BOT_TOKEN'));
  setupListeners(bot);
  bot.launch();
  bot.catch((e) => console.error(getErrorMsg(e)));
};

main();
