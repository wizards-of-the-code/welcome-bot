import { Context, Telegraf } from 'telegraf';

export type Bot = Telegraf;
export type BotContext = Context;

export enum CollectionsEnum {
  'FOOTER' = 'wb-chat-footers',
  'CHAT_SETTINGS' = 'wb-chat-settings',
  'MIGRATED_MESSAGES' = 'wb-migrated-messages',
}

export enum FooterTitles {
  'STANDARD' = 'Стандартный',
}
