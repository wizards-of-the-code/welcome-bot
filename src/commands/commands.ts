import getBot from '../setupBot/setupBot';
import { Command } from './command.class';
import { OwnerMessageCommand } from './handlers/ownerMessageCommand';
import { CommandEnum, CustomCommand } from './types';
import { SetupGroupCommand } from './handlers/setupGroupCommand';
import { StopGroupCommand } from './handlers/stopGroupCommand';
import { CaptchaCommand } from './handlers/captchaCommand';

const bot = getBot();
export const commandHandlers: Command[] = [
  new OwnerMessageCommand(bot),
  new SetupGroupCommand(bot),
  new StopGroupCommand(bot),
  new CaptchaCommand(bot),
];

type CommandDescription = {
  command: CommandEnum;
  description: string;
};
export const botCommands: CommandDescription[] = [
  { command: CommandEnum.SETUP_GROUP, description: 'Bot starts managing chat.' },
  {
    command: CommandEnum.STOP_GROUP,
    description: 'Bot stops managing chat.',
  },
  {
    command: CommandEnum.OWNER_MESSAGE,
    description: 'Sends available actions on owner message.',
  },
  {
    command: CommandEnum.CAPTCHA,
    description: 'Changes type of captcha.',
  },
];
