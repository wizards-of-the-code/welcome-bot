import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CollectionsEnum } from '../contracts';
import { ChatSettingsType, FooterType, MigratedChatDataType } from './types';

export const footerSchema = new Schema<FooterType>(
  {
    message: {
      required: true,
      type: String,
    },
  },
  { collection: CollectionsEnum.FOOTER },
);

export const migratedChatMessagesSchema = new Schema<MigratedChatDataType>(
  {
    telegram_id: {
      type: Number,
      required: true,
    },
    wm: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    title: {
      type: String,
    },
    invite_link: {
      type: String,
    },
    administrators: {
      type: [String],
    },
  },
  { collection: CollectionsEnum.MIGRATED_MESSAGES },
);

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
    chatId: {
      type: Number,
      required: true,
    },
    chatType: {
      type: String,
      required: true,
    },
    administrators: {
      type: [String],
      default: [],
    },
    botEnabled: {
      type: Boolean,
      default: false,
    },
    previousSentMessage: {
      messageId: {
        type: Number,
      },
      chatId: {
        type: Number,
      },
    },
    footer: { type: ObjectId, ref: 'Footer', required: true },
  },
  { collection: CollectionsEnum.CHAT_SETTINGS, timestamps: true },
);
