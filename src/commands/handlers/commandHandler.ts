import { CommandOption } from '../commands';
import { BotContext } from '../../contracts';
import setupGroup from './setupGroup';
import stopGroup from './stopGroup';

const commandHandler: Record<CommandOption, (ctx: BotContext) => Promise<void>> = {
  setup_group: setupGroup,
  stop_group: stopGroup,
};

export default commandHandler;
