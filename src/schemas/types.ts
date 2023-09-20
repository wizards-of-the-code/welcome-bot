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
  username: string;
};

export type ChatSettingsType = {
  _id: ObjectId;
  message: string;
  chatTitle: string;
  chatId: number;
  chatType: string;
  botEnabled: boolean;
  administrators: number[];
  creator: CreatorType;
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
