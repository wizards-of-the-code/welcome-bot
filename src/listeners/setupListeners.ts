import onNewChatMembers from './handlers/onNewChatMembers';
import onLeftChatMember from './handlers/onLeftChatMember';
import onNewMessage from './handlers/onNewMessage';
import getBot from '../setupBot';

const setupListeners = () => {
  const bot = getBot();
  onNewChatMembers(bot);
  onLeftChatMember(bot);
  onNewMessage(bot);
};

export default setupListeners;
