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
  previousSentMessage?:SentWelcomeMessageType;
  message: string;
  chatTitle: string;
  createdAt: Date;
  updatedAt: Date;
};
