import { BotContext } from '../../contracts';

export type SendMessageToChatParams = {
  ctx: BotContext;
  message: string;
  chatId: number;
  disableNotification?: boolean;
};

export type SendMessageToChatsParams = Omit<SendMessageToChatParams, 'chatId'> & {
  chats: number[];
};

export const sendMessageToChat = async ({
  ctx,
  chatId,
  message,
  disableNotification,
}: SendMessageToChatParams) =>
  await ctx.telegram.sendMessage(chatId, message, {
    disable_notification: disableNotification,
  });

/**
 * Sends owner message to all chats where bot is enabled
 * @param {SendMessageToChatsParams}
 */
export const sendMessageToChats = async ({
  ctx,
  chats,
  message,
  disableNotification = true,
}: SendMessageToChatsParams) => {
  await ctx.deleteMessage();
  await Promise.all(
    chats.map((chatId) =>
      sendMessageToChat({
        chatId,
        message: message,
        ctx,
        disableNotification,
      }),
    ),
  );
};

/**
 * Sends owner message to all chats where bot is enabled & pins the message
 * @param {SendMessageToChatsParams}
 */
export const sendAndPinMessageToChats = async ({
  ctx,
  message,
  chats,
  disableNotification = true,
}: SendMessageToChatsParams) => {
  await ctx.deleteMessage();
  await Promise.all(
    chats.map((chatId) =>
      sendMessageToChat({
        chatId,
        message: message,
        ctx,
        disableNotification,
      }).then((sentMessage) =>
        ctx.telegram.pinChatMessage(chatId, sentMessage.message_id, {
          disable_notification: disableNotification,
        }),
      ),
    ),
  );
};
