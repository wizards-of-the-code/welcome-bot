import { getErrorMsg } from '../listeners/helpers/helpers';
import logger from '../logger/logger';
import { cancelNewOwnerMessage, saveNewOwnerMessage } from './handler/newOwnerMessage';

export const setupActions = () => {
  try {
    logger.info('Set-upping actions');
    saveNewOwnerMessage();
    cancelNewOwnerMessage();
  } catch (e) {
    logger.error(`While handle action ${getErrorMsg(e)}`);
  }
};
