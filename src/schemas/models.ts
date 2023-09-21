import { model } from 'mongoose';
import {
	chatSettingsSchema,
	footerSchema,
	migratedChatMessagesSchema,
	ownerMessageSchema,
	profileSchema
} from './welcomeBotSchemas';
import {ChatSettingsType, FooterType, MigratedChatDataType, OwnerMessageType, ProfileType} from './types';

export const Footer = model<FooterType>('Footer', footerSchema);
export const ChatSettings = model<ChatSettingsType>('Chat-settings', chatSettingsSchema);
export const MigratedChatMessages = model<MigratedChatDataType>(
  'Migrated-chat-messages',
  migratedChatMessagesSchema,
);

export const Profile = model<ProfileType>('Profile', profileSchema)

export const OwnerMessage = model<OwnerMessageType>('Owner-message', ownerMessageSchema)
