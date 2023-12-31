import { Context, NarrowedContext, Scenes, Telegraf } from 'telegraf';
import { Message, Update, User } from '@telegraf/types';
import {CaptchaEnum} from "./schemas/types";

export type NewChatMembers = Message.NewChatMembersMessage['new_chat_members'];


export interface SessionData extends Scenes.WizardSession {
  ownerMessage: string;
  newChatMember: User;
  captchaAnswer: string;
  counter: number;
  captcha?: CaptchaEnum;
  welcome: {
    welcomeMessage: string;
    footer: string;
    previousSentMessage?: {
      chatId: number;
      messageId: number;
    };
  };
}

export interface BotContext extends Context {
  session: SessionData;
  scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<BotContext>;
}

export type Bot = Telegraf<BotContext>;
export type MessageUpdate = NarrowedContext<
  BotContext,
  Update.MessageUpdate<Record<'text', {}> & Message.TextMessage>
>;

export type NewChatMemberUpdate = NarrowedContext<
  BotContext,
  Update.MessageUpdate<Record<'new_chat_members', {}> & Message.NewChatMembersMessage>
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
