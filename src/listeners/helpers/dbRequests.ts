import { escapeForMarkdown2, getErrorMsg } from './helpers';
import { BotContext, FooterTitles } from '../../contracts';
import { FooterType, SentWelcomeMessageType } from '../../schemas/types';
import { ChatSettings, Footer, MigratedChatMessages } from '../../schemas/models';
import { defaultWelcomeMessage } from '../../constants';
import logger from '../../logger/logger';

/**
 * Deletes previous sent message, add current sent message to db
 * @param {BotContext} ctx
 * @param {SentWelcomeMessageType} sentMessage
 * @param {SentWelcomeMessageType} prevSentMessage
 * */
export const deletePreviousSentMessage = async (
  ctx: BotContext,
  sentMessage: SentWelcomeMessageType,
  prevSentMessage?: SentWelcomeMessageType,
) => {
  if (ctx.chat && 'title' in ctx.chat) {
    const chatTitle = ctx.chat.title;
    try {
      if (prevSentMessage) {
        try {
          await ctx.telegram.deleteMessage(prevSentMessage.chatId, prevSentMessage.messageId);
        } catch (e) {
          logger.error(`While deleting previous sent message: ${getErrorMsg(e)}`);
        }
      }
      await ChatSettings.updateOne(
        { chatTitle },
        {
          previousSentMessage: sentMessage,
        },
      );
    } catch (e) {
      logger.error(`In handleDeletingPreviousMessage: ${getErrorMsg(e)}`);
    }
  }
};

export type ChatEssentials = {
  welcomeMessage: string;
  footer: string;
  prevSentMessage?: SentWelcomeMessageType;
};
/**
 * Creates required collections in database;
 * @param {number} chatId
 * @return {Omit<ChatEssentials, 'prevSentMessage>}
 */
export const initializeNewChat = async (
  chatId: number,
  chatTitle: string,
): Promise<Omit<ChatEssentials, 'prevSentMessage'>> => {
  const footer = await Footer.findOne({ title: FooterTitles.STANDARD }).lean();
  const migratedData = await MigratedChatMessages.findOne({ telegram_id: chatId })
    .select('wm')
    .lean();
  const chatSettings = await new ChatSettings({
    message: migratedData ? migratedData.wm : escapeForMarkdown2(defaultWelcomeMessage),
    chatId,
    chatTitle,
    footer,
  }).save();
  return { footer: footer?.message ?? '', welcomeMessage: chatSettings.message };
};

/**
 * Gets welcome message and footer
 * @param {string} chatId
 * @return {Promise<ChatEssentials>}
 * */
export const getChatEssentials = async (
  chatId: number,
  chatTitle: string,
): Promise<ChatEssentials> => {
  const chatSettings = await ChatSettings.findOne({ chatId }).populate<FooterType>('footer');
  if (!chatSettings) {
    const { footer, welcomeMessage } = await initializeNewChat(chatId, chatTitle);
    return { footer, welcomeMessage };
  }
  return {
    welcomeMessage: chatSettings.message,
    footer: chatSettings.footer.message,
    prevSentMessage: chatSettings.previousSentMessage,
  };
};
