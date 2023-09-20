import { Bot } from '../contracts';
import { getErrorMsg } from '../listeners/helpers/helpers';
import commands from './commands';
import logger from '../logger/logger';
import commandHandler from './handlers/commandHandler';

const setupCommands = async (bot: Bot) => {
  try {
    await bot.telegram.setMyCommands(commands);
    commands.forEach(({ command }) => bot.command(command, commandHandler[command]));
  } catch (e) {
    logger.error(`In setup commands - ${getErrorMsg(e)}`);
  }
};

export default setupCommands;
