import { escapers } from '@telegraf/entity';
import { SessionData } from '../../contracts';
import { User } from '@telegraf/types';
import { ChatSettingsType } from '../../schemas/types';

/**
 * Takes error and returns error message
 * @param err
 * @return {string} Error message
 * */
export const getErrorMsg = (err: unknown | Error): string => {
  if (err instanceof Error) {
    return err.message;
  }
  return JSON.stringify(err);
};

/**
 * Adds backslash before special chars
 * @example Abc_df, -> Abc\_df\,
 * @param {string} text
 * @return {string}
 * */
export const escapeForMarkdown2 = (text: string): string => escapers.MarkdownV2(text);

/**
 * Mentions user in Markdown2
 * @param {string} username
 * @param {number} id
 * @return {string}
 */
export const customMention = (username: string, id: number): string =>
  `[@${escapeForMarkdown2(username)}](tg://user?id=${id})`;

/**
 * Adds backslash before special chars
 * @example Abc_df, -> Abc\_df\,
 * @param {string} text
 * @return {string}
 * */
export const addBackslashBeforeSpecialChars = (text: string): string =>
  text.replace(/[^A-ZА-Я0-9]/gi, '\\$&');

export const formSessionOnNewChatMember = ({ session, newMember, chatSettings }: {
  session: SessionData;
  newMember: User;
  chatSettings: ChatSettingsType;
}) => {
  session.welcome = {
    welcomeMessage: chatSettings.message,
    footer: chatSettings.footer.message,
    previousSentMessage: chatSettings.previousSentMessage,
  };
  session.newChatMember = newMember;
  session.counter = 0;
  session.captcha = chatSettings.captcha;
};
