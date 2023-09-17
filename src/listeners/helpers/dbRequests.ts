import { Greeting } from '../contracts';
import { getErrorMsg } from './helpers';
import {
  Footer,
  SentWelcomeMessage,
  SentWelcomeMessageType,
  WelcomeMessage,
} from '../../schemas/chatBotSchemas';
import { BotContext } from '../../contracts';

/**
 * Deletes previous sent message, add current sent message to db
 * @param {BotContext} ctx
 * @param {SentWelcomeMessageType} sentMessage
 * */
export const handleDeletingPreviousMessage = async (
  ctx: BotContext,
  sentMessage: Omit<SentWelcomeMessageType, 'createdAt' | 'updatedAt' | '_id'>,
) => {
  if (ctx.chat && 'title' in ctx.chat) {
    const chatTitle = ctx.chat.title;

    try {
      const previousSentMessage = await SentWelcomeMessage.findOneAndDelete({ chatTitle })
        .select('messageId chatId')
        .lean();

      if (previousSentMessage) {
        try {
          await ctx.telegram.deleteMessage(
            previousSentMessage.chatId,
            previousSentMessage.messageId,
          );
        } catch (e) {
          console.error(getErrorMsg(e));
        }
      }

      await new SentWelcomeMessage(sentMessage).save();
    } catch (e) {
      console.error(`While deleting welcome message: ${getErrorMsg(e)}`);
    }
  }
};

/**
 * Gets welcome message and footer
 * @param {string} forChat
 * @return {Promise<Greeting>}
 * */
export const getChatGreeting = async (forChat: string): Promise<Greeting> => {
  const [footer, welcomeMessage] = await Promise.all([
    Footer.findOne().lean(),
    WelcomeMessage.findOne({ forChat }).select('message').lean(),
  ]);

  if (!welcomeMessage || !footer) {
    throw new Error(`While getting welcome message for chat - ${forChat}`);
  }
  return {
    welcomeMessage: welcomeMessage.message,
    footer: footer.message,
  };
};
