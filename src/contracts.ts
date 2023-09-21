import { Context, NarrowedContext, Telegraf } from 'telegraf';
import { Message, Update } from '@telegraf/types';

export type Bot = Telegraf;
export type BotContext = Context;
export type MessageUpdate = NarrowedContext<
  BotContext,
  Update.MessageUpdate<Record<'text', {}> & Message.TextMessage>
>;

export enum CollectionsEnum {
  'FOOTER' = 'wb-chat-footers',
  'CHAT_SETTINGS' = 'wb-chat-settings',
  'MIGRATED_MESSAGES' = 'wb-migrated-messages',
  'PROFILE' = 'wb-profiles',
}

export enum FooterTitles {
  'STANDARD' = 'Стандартный',
}
