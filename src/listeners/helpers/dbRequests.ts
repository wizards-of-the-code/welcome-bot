import { BotContext } from '../../contracts';
import { ChatSettingsType, FooterType, SentWelcomeMessageType } from '../../schemas/types';
import { ChatSettings } from '../../schemas/models';

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
    if (prevSentMessage) {
      await ctx.telegram.deleteMessage(prevSentMessage.chatId, prevSentMessage.messageId);
    }

    await ChatSettings.updateOne(
      { chatTitle },
      {
        previousSentMessage: sentMessage,
      },
    );
  }
};

/**
 * Gets chat settings
 * @param {number} chatId
 * @param {string} chatTitle
 * @return {Promise<ChatSettingsType>}
 * */
export const getChatSettings = async (
  chatId: number,
  chatTitle: string,
): Promise<ChatSettingsType> => {
  const chatSettings = await ChatSettings.findOne({ chatId }).populate<FooterType>('footer');
  if (!chatSettings) throw new Error(`Chat settings for chat ${chatTitle} not found`);
  return chatSettings;
};
