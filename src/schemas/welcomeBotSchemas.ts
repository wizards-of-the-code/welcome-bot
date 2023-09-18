import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CollectionsEnum } from '../contracts';

export const footerSchema = new Schema(
  {
    message: {
      required: true,
      type: String,
    },
  },
  { collection: CollectionsEnum.FOOTER },
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
      },
      chatId: {
        type: Number,
      },
    },
  },
  { collection: CollectionsEnum.CHAT_SETTINGS, timestamps: true },
);
