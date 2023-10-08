import { BotContext } from '../contracts';
import logger from '../logger/logger';
import { customMention, escapeForMarkdown2, getErrorMsg } from '../listeners/helpers/helpers';
import { ChatSettings } from '../schemas/models';

export const welcomeNewMember = async (ctx: BotContext) => {
  const { chat, session } = ctx;
  logger.info('Handle "new_chat_members" event for chat');
  if (!chat || !session.newChatMembers?.length) return;
  try {
    const newMember = session.newChatMembers[0];
    const newMemberName = newMember.username || newMember.first_name;
    const { message_id: messageId } = await ctx.telegram.sendMessage(
      chat.id,
      `${customMention(newMemberName, newMember.id)}\n${session.welcome.welcomeMessage}\n\n${
        session.welcome.footer
      }`,
      {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      },
    );
    await ChatSettings.updateOne(
      { chatId: chat.id },
      {
        previousSentMessage: { messageId, chatId: chat.id },
      },
    );
  } catch (e) {
    logger.error(`While handling "new_chat_members" event: ${getErrorMsg(e)}`);
  }
};
