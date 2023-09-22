import getBot from '../setupBot';
import { Command } from './command.class';
import { OwnerMessageCommand } from './handlers/ownerMessageCommand';
import { CommandEnum, CustomCommand } from './types';

const bot = getBot();
export const commandHandlers: Command[] = [new OwnerMessageCommand(bot)];

export const botCommands: CustomCommand[] = [
  { command: CommandEnum.SETUP_GROUP, description: 'Bot starts managing chat' },
  {
    command: CommandEnum.STOP_GROUP,
    description: 'Bot stops managing chat',
  },
  {
    command: CommandEnum.OWNER_MESSAGE,
    description: 'Sends available actions on owner message',
  },
];
