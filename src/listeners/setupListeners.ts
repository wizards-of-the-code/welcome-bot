import onNewChatMembers from './handlers/onNewChatMembers';
import onLeftChatMember from './handlers/onLeftChatMember';
import onNewMessage from './handlers/onNewMessage';
import getBot from '../setupBot/setupBot';
import logger from '../logger/logger';

const setupListeners = () => {
  const bot = getBot();
  logger.info('Set-upping listeners');
  onNewChatMembers(bot);
  onLeftChatMember(bot);
  onNewMessage(bot);
};

export default setupListeners;
