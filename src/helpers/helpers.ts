import { BotContext } from '../contracts';
import logger from '../logger/logger';
import { getErrorMsg } from '../listeners/helpers/helpers';

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
