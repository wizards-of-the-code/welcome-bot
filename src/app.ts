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

  bot.use(
    new LocalSession({
      database: `sessions/sessions.json`,
    }).middleware(),
  );

  setupActions(bot);
  await setupCommands(bot);
  setupListeners(bot);

  bot.command('Во все группы', (ctx) => {
    ctx.reply('Во все группы');
  });

  bot.action('С закреплением', (ctx) => {
    ctx.reply('С закреплением');
  });

  bot.action('С уведомлением', (ctx) => {
    ctx.reply('С уведомлением');
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  try {
    logger.info('Bot is launched');
    await bot.launch();
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};
main();
