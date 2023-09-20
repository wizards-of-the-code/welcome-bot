import { BotCommand } from '@telegraf/types';

export type CommandOption = 'setup_group' | 'stop_group';

export interface CustomCommand extends BotCommand {
  command: CommandOption;
}

const commands: CustomCommand[] = [
  { command: 'setup_group', description: 'Bot starts managing chat' },
  {
    command: 'stop_group',
    description: 'Bot stops managing chat',
  },
];

export default commands;
