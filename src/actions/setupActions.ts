import { handleOwnerMessageCancel, handleOwnerMessageSave } from './handlers/setupOwnerMessage';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';
import {
  notifyOwnerMessage,
  pinOwnerMessage,
  sendOwnerMessage,
} from './handlers/manageOwnerMessage';
import getBot from "../setupBot";

export const setupActions = () => {
  const bot = getBot();
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
