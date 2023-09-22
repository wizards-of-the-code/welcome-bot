import { BotCommand } from 'telegraf/typings/core/types/typegram';

export enum CommandEnum {
  'SETUP_GROUP' = 'setup_group',
  'STOP_GROUP' = 'stop_group',
  'OWNER_MESSAGE' = 'owner_message',
}

export interface CustomCommand extends BotCommand {
  command: CommandEnum;
}
