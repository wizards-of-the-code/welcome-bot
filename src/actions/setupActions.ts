import { Bot } from '../contracts';
import { handleOwnerMessageCancel, handleOwnerMessageSave } from './handlers/setupOwnerMessage';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';
import {
  notifyOwnerMessage,
  pinOwnerMessage,
  sendOwnerMessage,
} from './handlers/manageOwnerMessage';

/**
 * Setups actions
 * @param bot
 */
export const setupActions = (bot: Bot) => {
  try {
    logger.info('Set-upping actions');
    handleOwnerMessageSave(bot);
    handleOwnerMessageCancel(bot);
    sendOwnerMessage(bot);
    pinOwnerMessage(bot);
    notifyOwnerMessage(bot);
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};
