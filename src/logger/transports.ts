import winston from 'winston';
import configService from '../config/ConfigService';

export const defaultTransportOptions = {
  datePattern: 'MM-DD-YYYY-HH',
  zippedArchive: true,
  maxSize: '15m',
  maxFiles: '14d',
  dirname: configService.get('MODE') === 'production' ? configService.get('LOGS_PATH') : 'logs',
};

export const defaultTransport = new winston.transports.DailyRotateFile({
  filename: '%DATE%.log',
  ...defaultTransportOptions,
});
