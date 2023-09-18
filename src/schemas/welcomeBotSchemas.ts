import { Schema } from 'mongoose';
import { ChatSettingsType, FooterType } from './types';

export const chatSettingsSchema = new Schema<ChatSettingsType>(
  {
    message: {
      type: String,
      required: true,
    },
    chatTitle: {
      type: String,
      required: true,
    },
    previousSentMessage: {
      messageId: {
        type: Number,
        required: true,
      },
      chatId: {
        type: Number,
        required: true,
      },
    },
  },
  { collection: 'chat-settings', timestamps: true },
);

export const footerSchema = new Schema<FooterType>(
  {
    message: {
      required: true,
      type: String,
    },
  },
  { collection: 'footer' },
);
