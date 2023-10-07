import { Context, NarrowedContext, Telegraf } from 'telegraf';
import { Message, Update } from '@telegraf/types';

export interface SessionData {
  ownerMessage: string;
}
export type BotContext = Context & {
  session: SessionData;
};
export type Bot = Telegraf<BotContext>;
export type MessageUpdate = NarrowedContext<
  BotContext,
  Update.MessageUpdate<Record<'text', {}> & Message.TextMessage>
>;

export enum CollectionsEnum {
  'FOOTER' = 'wb-chat-footers',
  'CHAT_SETTINGS' = 'wb-chat-settings',
  'MIGRATED_MESSAGES' = 'wb-migrated-messages',
  'PROFILE' = 'wb-profiles',
  'OWNER_MESSAGE' = 'wb-owner-messages',
  'BOT_DESCRIPTION' = 'wb-bot-description',
}

export enum FooterTitles {
  'STANDARD' = 'Стандартный',
}
