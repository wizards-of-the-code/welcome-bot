import { Context, NarrowedContext, Scenes, Telegraf } from 'telegraf';
import { Message, Update, User } from '@telegraf/types';

export type NewChatMembers = Message.NewChatMembersMessage['new_chat_members'];

export interface MyWizardSession extends Scenes.WizardSessionData {
  captchaAnswer: string;
  counter: number;
}
export type MySceneSession = Scenes.SceneContextScene<BotContext, MyWizardSession>

export interface SessionData extends Scenes.WizardSession<MyWizardSession> {
  ownerMessage: string;
  newChatMember: User;
  captchaAnswer: string;
  counter: number;
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
  scene: MySceneSession;
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
