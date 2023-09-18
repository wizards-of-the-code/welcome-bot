import { model } from 'mongoose';
import { chatSettingsSchema, footerSchema } from './welcomeBotSchemas';
import { ChatSettingsType, FooterType } from './types';

export const Footer = model<FooterType>('Footer', footerSchema);
export const ChatSettings = model<ChatSettingsType>('Chat-settings', chatSettingsSchema);
