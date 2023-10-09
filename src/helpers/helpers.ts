import { BotContext } from '../contracts';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';
import {calculateUntilDate} from "../scenes/helpers";

export const hasObjectKey = (obj: unknown, key: string): boolean => {
  if (obj instanceof Object) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return false;
};

export const getAndDeleteItemFromArr = <T>(index: number, array: T[]): T => {
  const item = array[index];
  array.splice(index, 1);
  return item;
};

export const deleteMessage = async (ctx: BotContext, chatID: number, messageID: number) => {
  try {
    await ctx.telegram.deleteMessage(chatID, messageID);
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};

export const getAdminIDS = async (ctx: BotContext) => {
  const admins = await ctx.getChatAdministrators();
  return admins.map((admin) => admin.user.id);
};

export const banUser = async (ctx: BotContext, userToBan: number, banTime: number) => {
  if (!ctx.chat || ctx.chat.type === 'private') return;
  try {
    await ctx.telegram.banChatMember(ctx.chat.id, userToBan, calculateUntilDate(banTime));
    logger.warn(`USER - id-${userToBan} is banned for ${banTime}h in chat - ${ctx.chat.title}`);
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};
