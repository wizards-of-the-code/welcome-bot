import { ObjectId } from 'mongodb';

export type SentWelcomeMessageType = {
  messageId: number;
  chatId: number;
};

export type FooterType = {
  _id: ObjectId;
  message: string;
};

export type CreatorType = {
  id: number;
  username?: string;
};

export enum CaptchaEnum {
  DIGIT = 'digit',
  IMAGE = 'image'
}
export type ChatSettingsType = {
  _id: ObjectId;
  message: string;
  chatTitle: string;
  chatId: number;
  chatType: string;
  botEnabled: boolean;
  isPrivateGroup: boolean;
  administrators: number[];
  creator: CreatorType | null;
  captcha?: CaptchaEnum;
  previousSentMessage?: SentWelcomeMessageType;
  footer: FooterType;
  createdAt: Date;
  updatedAt: Date;
};

export type MigratedChatDataType = {
  _id: ObjectId;
  wm: string;
  telegram_id: number;
  administrators?: string[];
  username?: string;
  title?: string;
  invite_link?: string;
};

export type ProfileType = {
  _id: ObjectId;
  chatId: number;
  username?: string;
  firstname: string;
  tags: string[];
  userId: number;
};

export type OwnerMessageType = {
  _id: ObjectId;
  message: string;
  ownerUsername: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BotDescriptionType = {
  _id: ObjectId;
  description: string;
}
