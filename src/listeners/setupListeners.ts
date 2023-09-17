import onNewChatMembers from './handlers/onNewChatMembers';
import onLeftChatMember from './handlers/onLeftChatMember';
import onNewMessage from './handlers/onNewMessage';
import { Bot } from '../contracts';

/**
 * @param {TelegramBot} bot;
 */
const setupListeners = (bot: Bot) => {
  onNewChatMembers(bot);
  onLeftChatMember(bot);
  // onNewMessage(bot);
};

export default setupListeners;
