import { Bot } from '../contracts';
import setupChat from './handlers/setupChat';
import stopChat from './handlers/stopChat';

const setupCommands = (bot: Bot) => {
  bot.command('setupChat', (ctx) => setupChat(ctx));
  bot.command('stopChat', (ctx) => stopChat(ctx));
};

export default setupCommands;
