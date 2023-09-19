import * as mongoose from 'mongoose';
import config from '../config/ConfigService';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';

const connectToMongoose = async () => {
  const uri = `mongodb+srv://${config.get('MONGO_USERNAME')}:${config.get(
    'MONGO_PASSWORD',
  )}@botdb.ixjj9ng.mongodb.net/${config.get('MONGO_DB_NAME')}`;

  try {
    logger.info('Connecting to Mongoose');
    await mongoose.connect(uri);
    logger.info('Connected to Mongoose');
  } catch (error) {
    logger.error('Error connecting to Mongoose:', getErrorMsg(error));
  }
};

export default connectToMongoose;
