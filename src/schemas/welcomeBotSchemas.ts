import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

export const footerSchema = new Schema(
  {
    message: {
      required: true,
      type: String,
    },
  },
  { collection: 'footer' },
);

export const chatSettingsSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    chatTitle: {
      type: String,
      required: true,
    },
    footer: { type: ObjectId, ref: 'Footer', required: true },
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
