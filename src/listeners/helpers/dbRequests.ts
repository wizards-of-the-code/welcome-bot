import { getErrorMsg } from './helpers';
import { BotContext } from '../../contracts';
import { FooterType, SentWelcomeMessageType } from '../../schemas/types';
import { ChatSettings, Footer } from '../../schemas/models';

/**
 * Deletes previous sent message, add current sent message to db
 * @param {BotContext} ctx
 * @param {SentWelcomeMessageType} sentMessage
 * @param {SentWelcomeMessageType} prevSentMessage
 * */
export const handleDeletingPreviousMessage = async (
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
          console.error(getErrorMsg(e));
        }
      }

      await ChatSettings.updateOne(
        { chatTitle },
        {
          previousSentMessage: sentMessage,
        },
      );
    } catch (e) {
      console.error(`While deleting welcome message: ${getErrorMsg(e)}`);
    }
  }
};

export type ChatEssentials = {
  welcomeMessage: string;
  footer: string;
  prevSentMessage?: SentWelcomeMessageType;
};
/**
 * Gets welcome message and footer
 * @param {string} chatTitle
 * @return {Promise<ChatEssentials>}
 * */
export const getChatEssentials = async (chatTitle: string): Promise<ChatEssentials> => {
  const chatSettings = await ChatSettings.findOne({ chatTitle }).populate<FooterType>('footer');

  if (!chatSettings) {
    throw new Error(`While getting welcome message for chat - ${chatTitle}`);
  }
  return {
    welcomeMessage: chatSettings.message,
    footer: chatSettings.footer.message,
    prevSentMessage: chatSettings.previousSentMessage,
  };
};
