import { BotDescription } from '../schemas/models';
import logger from '../logger/logger';
import { Bot } from '../contracts';

export const setBotDescription = (bot: Bot) => {
  BotDescription.findOne()
    .select('description')
    .lean()
    .then((descriptionObj) => {
      descriptionObj && logger.info('Setting my bot description');
      return descriptionObj && bot?.telegram.setMyDescription(descriptionObj.description);
    })
    .then((bool) => logger.info(`SetMyDescription - ${bool}`));
};
