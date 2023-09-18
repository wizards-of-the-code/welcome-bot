import { Context, Telegraf } from 'telegraf';

export type Bot = Telegraf;
export type BotContext = Context;

export enum CollectionsEnum {
  'FOOTER' = 'welcome-bot_footer',
  'CHAT_SETTINGS' = 'welcome-bot_chat-settings',
}
