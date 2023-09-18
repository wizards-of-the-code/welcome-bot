import { Context, Telegraf } from 'telegraf';

export type Bot = Telegraf;
export type BotContext = Context;

export enum CollectionsEnum {
  'FOOTER' = 'wb-chat-footer',
  'CHAT_SETTINGS' = 'wb-chat-settings',
}
