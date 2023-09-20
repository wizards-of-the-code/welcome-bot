import { ObjectId } from 'mongodb';

export type SentWelcomeMessageType = {
  messageId: number;
  chatId: number;
};

export type FooterType = {
  _id: ObjectId;
  message: string;
};

export type ChatSettingsType = {
  _id: ObjectId;
  message: string;
  chatTitle: string;
  chatId: number;
  administrators: string[];
  chatType: string;
  botEnabled: boolean;
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
