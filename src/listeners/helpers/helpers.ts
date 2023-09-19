import { escapers } from '@telegraf/entity';

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
export const mention = (username: string, id: number): string =>
  `[@${username}](tg://user?id=${id})`;
