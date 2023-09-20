import { model } from 'mongoose';
import { chatSettingsSchema, footerSchema, migratedChatMessagesSchema } from './welcomeBotSchemas';
import {ChatSettingsType, FooterType, MigratedChatDataType} from './types';

export const Footer = model<FooterType>('Footer', footerSchema);
export const ChatSettings = model<ChatSettingsType>('Chat-settings', chatSettingsSchema);
export const MigratedChatMessages = model<MigratedChatDataType>(
  'Migrated-chat-messages',
  migratedChatMessagesSchema,
);
