import { getErrorMsg } from '../listeners/helpers/helpers';
import logger from '../logger/logger';
import getBot from '../setupBot/setupBot';
import { botCommands, commandHandlers } from './commands';

const setupCommands = async () => {
  const bot = getBot();
  try {
    logger.info('Set-upping commands');
    await bot.telegram.setMyCommands(botCommands);
    commandHandlers.forEach((command) => command.handle());
  } catch (e) {
    logger.error(`In setup commands - ${getErrorMsg(e)}`);
  }
};

export default setupCommands;
