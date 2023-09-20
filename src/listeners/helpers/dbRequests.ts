import { escapeForMarkdown2, getErrorMsg } from './helpers';
import { BotContext, FooterTitles } from '../../contracts';
import { ChatSettingsType, FooterType, SentWelcomeMessageType } from '../../schemas/types';
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
 * @param {string} chatTitle
 * @param {string} chatType
 * @return {Omit<ChatSettingsType, 'prevSentMessage>}
 */
export const initializeNewChat = async (
  chatId: number,
  chatTitle: string,
  chatType: string,
): Promise<Omit<ChatSettingsType, 'prevSentMessage'>> => {
  const footer = (await Footer.findOne({ title: FooterTitles.STANDARD }).lean()) as FooterType;
  const migratedData = await MigratedChatMessages.findOne({ telegram_id: chatId })
    .select('wm administrators')
    .lean();
  const chatSettings = await new ChatSettings({
    message: migratedData ? migratedData.wm : escapeForMarkdown2(defaultWelcomeMessage),
    administrators: migratedData?.administrators || [],
    chatId,
    chatTitle,
    footer,
    chatType,
  }).save();
  return { ...chatSettings, footer };
};

/**
 * Gets chat settings
 * @param {number} chatId
 * @param {string} chatTitle
 * @param {string} chatType
 * @return {Promise<ChatSettingsType>}
 * */
export const getChatSettings = async (
  chatId: number,
  chatTitle: string,
  chatType: string,
): Promise<ChatSettingsType> => {
  const chatSettings = await ChatSettings.findOne({ chatId }).populate<FooterType>('footer');
  if (!chatSettings) {
    const chatSettings = await initializeNewChat(chatId, chatTitle, chatType);
    return chatSettings;
  }
  return chatSettings;
};
