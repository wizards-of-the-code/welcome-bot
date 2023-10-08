import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CollectionsEnum } from '../contracts';
import {
  BotDescriptionType,
  CaptchaEnum,
  ChatSettingsType,
  FooterType,
  MigratedChatDataType,
  OwnerMessageType,
  ProfileType,
} from './types';
import configService from '../config/ConfigService';

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
      type: [Number],
      default: [],
    },
    botEnabled: {
      type: Boolean,
      default: false,
    },
    creator: {
      id: { type: Number, required: true },
      username: { type: String, required: false },
    },
    previousSentMessage: {
      messageId: {
        type: Number,
      },
      chatId: {
        type: Number,
      },
    },
    isPrivateGroup: {
      type: Boolean,
      required: true,
    },
    captcha: {
      type: String,
      required: false,
      enum: [CaptchaEnum.DIGIT, CaptchaEnum.IMAGE],
    },
    footer: { type: ObjectId, ref: 'Footer', required: true },
  },
  { collection: CollectionsEnum.CHAT_SETTINGS, timestamps: true },
);

export const profileSchema = new Schema<ProfileType>(
  {
    chatId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { collection: CollectionsEnum.PROFILE },
);

export const ownerMessageSchema = new Schema<OwnerMessageType>(
  {
    message: {
      required: true,
      type: String,
    },
    ownerUsername: {
      required: true,
      type: String,
      default: configService.get('OWNER_USERNAME'),
    },
  },
  { collection: CollectionsEnum.OWNER_MESSAGE, timestamps: true },
);

export const botDescriptionSchema = new Schema<BotDescriptionType>(
  {
    description: {
      required: true,
      type: String,
    },
  },
  { collection: CollectionsEnum.BOT_DESCRIPTION, timestamps: false },
);
