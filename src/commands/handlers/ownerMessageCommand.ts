import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import { ChatSettings, OwnerMessage } from '../../schemas/models';
import { Command } from '../command.class';
import configService from '../../config/ConfigService';
import { CommandEnum } from '../types';
import logger from '../../logger/logger';
import { sendAndPinMessageToChats, sendMessageToChats } from '../helpers/sendMessage';
import { getErrorMsg } from '../../listeners/helpers/helpers';

export enum OwnerMessageActions {
  'PRIVATE_SEND_QUITE' = 'owner-message-private-send-quite',
  'PRIVATE_SEND_NOTIFY' = 'owner-message-private-send-notify',
  'PRIVATE_PIN_QUITE' = 'owner-message-private-pin-quite',
  'PRIVATE_PIN_NOTIFY' = 'owner-message-private-pin-notify',
  'PUBLIC_SEND_QUITE' = 'owner-message-public-send-quite',
  'PUBLIC_SEND_NOTIFY' = 'owner-message-public-send-notify',
  'PUBLIC_PIN_QUITE' = 'owner-message-public-pin-quite',
  'PUBLIC_PIN_NOTIFY' = 'owner-message-public-pin-notify',
  'SAVE' = 'owner-message-save',
  'CANCEL' = 'owner-message-cancel',
  'PRIVATE' = 'owner-message-private-groups',
  'PUBLIC' = 'owner-message-public-groups',
}

export const selectGroupTypeButtons: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('Публичные группы🔓', OwnerMessageActions.PUBLIC)],
  [Markup.button.callback('Приватные группы🔒', OwnerMessageActions.PRIVATE)],
];

export const sendToPrivateGroups: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('во все группы🔕', OwnerMessageActions.PRIVATE_SEND_QUITE)],
  [Markup.button.callback('во все группы🔔', OwnerMessageActions.PRIVATE_SEND_NOTIFY)],
  [Markup.button.callback('отправить и закрепить📌🔕', OwnerMessageActions.PRIVATE_PIN_QUITE)],
  [Markup.button.callback('отправить и закрепить📌🔔', OwnerMessageActions.PRIVATE_PIN_NOTIFY)],
];

export const sendToPublicGroups: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('во все группы🔕', OwnerMessageActions.PUBLIC_SEND_QUITE)],
  [Markup.button.callback('во все группы🔔', OwnerMessageActions.PUBLIC_SEND_NOTIFY)],
  [Markup.button.callback('отправить и закрепить📌🔕', OwnerMessageActions.PUBLIC_PIN_QUITE)],
  [Markup.button.callback('отправить и закрепить📌🔔', OwnerMessageActions.PUBLIC_PIN_NOTIFY)],
];

export const getPrivateChatsWhereBotEnabled = async (): Promise<number[]> => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true, isPrivateGroup: true })
    .select('chatId')
    .lean();
  return chatSettings.map((chat) => chat.chatId);
};

export const getPublicChatsWhereBotEnabled = async (): Promise<number[]> => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true, isPrivateGroup: false })
    .select('chatId')
    .lean();
  return chatSettings.map((chat) => chat.chatId);
};

export class OwnerMessageCommand extends Command {
  handle(): void {
    try {
      this.bot.command(CommandEnum.OWNER_MESSAGE, async (ctx) => {
        logger.info('Handling owner message command');
        if (!ctx.from || !ctx.from.username || ctx.chat?.type !== 'private') return;
        const { from } = ctx;
        if (configService.get('OWNER_USERNAME') !== from.username) return;

        const ownerMessage = await OwnerMessage.findOne({ ownerUsername: from?.username })
          .select('message')
          .lean();

        if (!ownerMessage || !ownerMessage.message) {
          await ctx.reply(
            'Сообщение еще не задано, чтоб задать сообщение, просто напишите мне любой текст',
          );
        } else {
          await ctx.reply('Выбирете тип групп', {
            reply_markup: {
              inline_keyboard: selectGroupTypeButtons,
              one_time_keyboard: true
            },
          });
        }
      });

      //PRIVATE
      this.bot.action(OwnerMessageActions.PRIVATE, async (ctx) => {
        await ctx.deleteMessage();
        await ctx.reply('Отправить ваше сообщение...', {
          reply_markup: {
            inline_keyboard: sendToPrivateGroups,
          },
        });
      });

      this.bot.action(OwnerMessageActions.PRIVATE_SEND_QUITE, async (ctx) => {
        const chats = await getPrivateChatsWhereBotEnabled();
        await sendMessageToChats({ ctx, chats, message: ctx.session.ownerMessage });
      });

      this.bot.action(OwnerMessageActions.PRIVATE_SEND_NOTIFY, async (ctx) => {
        const chats = await getPrivateChatsWhereBotEnabled();
        await sendMessageToChats({
          ctx,
          chats,
          message: ctx.session.ownerMessage,
          disableNotification: false,
        });
      });

      this.bot.action(OwnerMessageActions.PRIVATE_PIN_QUITE, async (ctx) => {
        const chats = await getPrivateChatsWhereBotEnabled();
        await sendAndPinMessageToChats({ ctx, chats, message: ctx.session.ownerMessage });
      });

      this.bot.action(OwnerMessageActions.PRIVATE_PIN_NOTIFY, async (ctx) => {
        const chats = await getPrivateChatsWhereBotEnabled();
        await sendAndPinMessageToChats({
          ctx,
          chats,
          message: ctx.session.ownerMessage,
          disableNotification: false,
        });
      });

      //PUBLIC
      this.bot.action(OwnerMessageActions.PUBLIC, async (ctx) => {
        await ctx.deleteMessage();
        await ctx.reply('Отправить ваше сообщение...', {
          reply_markup: {
            inline_keyboard: sendToPublicGroups,
          },
        });
      });

      this.bot.action(OwnerMessageActions.PUBLIC_SEND_QUITE, async (ctx) => {
        const chats = await getPublicChatsWhereBotEnabled();
        await sendMessageToChats({ ctx, chats, message: ctx.session.ownerMessage });
      });

      this.bot.action(OwnerMessageActions.PUBLIC_SEND_NOTIFY, async (ctx) => {
        const chats = await getPublicChatsWhereBotEnabled();
        await sendMessageToChats({
          ctx,
          chats,
          message: ctx.session.ownerMessage,
          disableNotification: false,
        });
      });

      this.bot.action(OwnerMessageActions.PUBLIC_PIN_QUITE, async (ctx) => {
        const chats = await getPublicChatsWhereBotEnabled();
        await sendAndPinMessageToChats({ ctx, chats, message: ctx.session.ownerMessage });
      });

      this.bot.action(OwnerMessageActions.PUBLIC_PIN_NOTIFY, async (ctx) => {
        const chats = await getPublicChatsWhereBotEnabled();
        await sendAndPinMessageToChats({
          ctx,
          chats,
          message: ctx.session.ownerMessage,
          disableNotification: false,
        });
      });
    } catch (e) {
      logger.error(`In OwnerMessageCommand class ${getErrorMsg(e)}`);
    }
  }
}
