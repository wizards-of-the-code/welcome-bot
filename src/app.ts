import ConfigService from './config/ConfigService';
import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import {Telegraf} from "telegraf";


const main = async () => {
  const config = new ConfigService();

  await connectToMongoose(config);
  const bot = new Telegraf(config.get('BOT_TOKEN') );
  setupListeners(bot);
  bot.launch()
};

main();
