import { message } from 'telegraf/filters';
import { escapeTextForMarkdown2, getErrorMsg, mention } from '../helpers/helpers';
import { getChatEssentials, handleDeletingPreviousMessage } from '../helpers/dbRequests';
import { Bot } from '../../contracts';
import logger from "../../logger/logger";

/**
 * @param {Bot} bot;
 */
const onNewChatMembers = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    try {
      const { chat } = ctx;
      if ('title' in chat) {
        const { welcomeMessage, footer, prevSentMessage } = await getChatEssentials(chat.title);
        const newMember = ctx.message.new_chat_members[0];
        const newMemberName = escapeTextForMarkdown2(newMember.username ?? newMember.first_name);

        const { message_id: messageId } = await ctx.sendMessage(
          `${mention(newMemberName, newMember.id)} ${welcomeMessage}\n\n${footer}`,
          {
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true
          },
        );

        await handleDeletingPreviousMessage(
          ctx,
          {
            messageId,
            chatId: chat.id,
          },
          prevSentMessage,
        );
      }

      // Deletes message that says that user has joined the group
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (e) {
      logger.error(getErrorMsg(e));
    }
  });
};
export default onNewChatMembers;
