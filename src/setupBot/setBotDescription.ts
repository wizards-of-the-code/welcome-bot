import { BotDescription } from '../schemas/models';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';
import getBot from "./setupBot";

export const setBotDescription = async () => {
  const bot = getBot()
  try {
    const descriptionObj = await BotDescription.findOne().select('description').lean();
    if (descriptionObj) {
      logger.info('Setting my bot description');
      const result = await bot.telegram.setMyDescription(descriptionObj.description);
      result && logger.info(`SetMyDescription - ${result}`);
    }
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};
