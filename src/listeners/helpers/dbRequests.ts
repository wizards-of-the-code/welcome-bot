import { BotContext } from '../../contracts';
import { ChatSettingsType, FooterType, SentWelcomeMessageType } from '../../schemas/types';
import { ChatSettings } from '../../schemas/models';
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
  logger.info(`sentMsg - ${JSON.stringify(sentMessage)}`);
  logger.info(`prev - ${JSON.stringify(prevSentMessage)}`);
  if (prevSentMessage?.messageId && prevSentMessage.chatId) {
    await ctx.telegram.deleteMessage(prevSentMessage.chatId, prevSentMessage.messageId);
  }

  logger.info(`Updating "previousSentMessage" for chat: ${sentMessage.chatId}`);
  const upd = await ChatSettings.updateOne({
    previousSentMessage: sentMessage,
  }).exec();
  logger.info(`upd - ${JSON.stringify(upd)}`);
};

/**
 * Gets chat settings
 * @param {number} chatId
 * @return {Promise<ChatSettingsType>}
 * */
export const getChatSettingsWithFooter = async (
  chatId: number,
): Promise<ChatSettingsType | null> => {
  logger.info('Requesting chat settings & populating footer');
  const chatSettings = await ChatSettings.findOne({ chatId: chatId })
    .populate<FooterType>('footer')
    .exec();
  return chatSettings;
};
