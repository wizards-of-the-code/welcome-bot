import winston from 'winston';
import 'winston-daily-rotate-file';
import config from '../config/ConfigService';
import { loggerColors } from './constants';
import { defaultTransport } from './transports';

const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ message, timestamp, level }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: config.get('LOGGER_LEVEL') || 'info',
  format: combine(timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }), myFormat),
  transports: [defaultTransport],
});
winston.addColors(loggerColors);

if (config.get('MODE') !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
    }),
  );
}

export default logger;
