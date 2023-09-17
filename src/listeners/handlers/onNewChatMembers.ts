import { message } from 'telegraf/filters';
import { escapeTextForMarkdown2, getErrorMsg, mention } from '../helpers/helpers';
import { getChatGreeting, handleDeletingPreviousMessage } from '../helpers/dbRequests';
import { Bot } from '../../contracts';

/**
 * @param {Bot} bot;
 */
const onNewChatMembers = (bot: Bot) => {
  bot.on(message('new_chat_members'), async (ctx) => {
    try {
      // Deletes message that says that user has joined the group
      await ctx.deleteMessage(ctx.message.message_id);

      const { chat } = ctx;
      if ('title' in chat) {
        const { welcomeMessage, footer } = await getChatGreeting(chat.title);
        const newMember = ctx.message.new_chat_members[0];
        const newMemberName = escapeTextForMarkdown2(newMember.username ?? newMember.first_name);

        const { message_id: messageId } = await ctx.sendMessage(
          `${mention(newMemberName, newMember.id)} ${welcomeMessage}\n\n${footer}`,
          {
            parse_mode: 'MarkdownV2',
          },
        );

        await handleDeletingPreviousMessage(ctx, {
          messageId,
          chatId: chat.id,
          chatTitle: chat.title,
        });
      }
    } catch (e) {
      console.error(getErrorMsg(e));
    }
  });
};
export default onNewChatMembers;
