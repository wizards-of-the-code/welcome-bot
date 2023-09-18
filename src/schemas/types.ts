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
  footer: FooterType;
  previousSentMessage?: SentWelcomeMessageType;
  createdAt: Date;
  updatedAt: Date;
};
