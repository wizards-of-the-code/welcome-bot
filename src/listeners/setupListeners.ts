import onLeftChatMember from './handlers/onLeftChatMember';
import onNewMessage from './handlers/onNewMessage';
import getBot from '../setupBot/setupBot';
import logger from '../logger/logger';
import {onNewChatMember} from "./handlers/onNewChatMember";

const setupListeners = () => {
  const bot = getBot();
  logger.info('Set-upping listeners');
  onLeftChatMember(bot);
  onNewMessage(bot);
  onNewChatMember(bot)
};

export default setupListeners;
