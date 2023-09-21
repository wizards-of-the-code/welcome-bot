import { message } from 'telegraf/filters';
import { escapeForMarkdown2, getErrorMsg, customMention } from '../helpers/helpers';
import { getChatSettingsWithFooter, deletePreviousSentMessage } from '../helpers/dbRequests';
import { Bot } from '../../contracts';
import logger from '../../logger/logger';

/**
 * @param {Bot} bot;
 */
const onNewChatMembers = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    try {
      const { chat } = ctx;
      if ('title' in chat) {
        logger.info(`Handle "new_chat_members" event for chat: ${chat.title}`);
        const chatSettings = await getChatSettingsWithFooter(chat.id);

        if (!chatSettings?.botEnabled) return;

        // Deletes message that says that user has joined the chat
        await ctx.deleteMessage(ctx.message.message_id);

        const newMember = ctx.message.new_chat_members[0];
        if (newMember.is_bot) return;

        const newMemberName = escapeForMarkdown2(newMember.username ?? newMember.first_name);
        const { message_id: messageId } = await ctx.reply(
          `${customMention(newMemberName, newMember.id)}\n${chatSettings.message}\n\n${
            chatSettings.footer.message
          }`,
          {
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true,
          },
        );

        await deletePreviousSentMessage(
          ctx,
          {
            messageId,
            chatId: chat.id,
          },
          chatSettings.previousSentMessage,
        );
      }
    } catch (e) {
      logger.error(`While handling "new_chat_members" event: ${getErrorMsg(e)}`);
    }
  });
};
export default onNewChatMembers;
