import { BotCommand } from '@telegraf/types';

export type CommandOption = 'setup_group' | 'stop_group' | 'owner_message';

export interface CustomCommand extends BotCommand {
  command: CommandOption;
}

const commands: CustomCommand[] = [
  { command: 'setup_group', description: 'Bot starts managing chat' },
  {
    command: 'stop_group',
    description: 'Bot stops managing chat',
  },
  {
    command: 'owner_message',
    description: 'Sends available actions on owner message',
  },
];

export default commands;
