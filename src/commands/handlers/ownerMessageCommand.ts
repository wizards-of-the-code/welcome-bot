import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import { OwnerMessage } from '../../schemas/models';
import { Command } from '../command.class';
import configService from '../../config/ConfigService';
import { CommandEnum } from '../types';
import logger from '../../logger/logger';
import { sendAndPinMessageToChats, sendMessageToChats } from '../helpers/sendMessage';
import { getErrorMsg } from '../../listeners/helpers/helpers';
import {
  getAllChatsWhereBotEnabled,
  getPrivateChatsWhereBotEnabled,
  getPublicChatsWhereBotEnabled
} from "../helpers/dbRequests";

export enum OwnerMessageActions {
  'SAVE' = 'owner-message-save',
  'CANCEL' = 'owner-message-cancel',
  'PRIVATE' = 'owner-message-private-groups',
  'PUBLIC' = 'owner-message-public-groups',
  'ALL' = 'owner-message-public-all',
}

export const ownerMessageSendingWay = {
  private: {
    sendQuitely: 'owner-message-private-send-quite',
    sendWithNotification: 'owner-message-private-send-notify',
    pinQuitely: 'owner-message-private-pin-quite',
    pinWithNotification: 'owner-message-private-pin-notify',
  },
  public: {
    sendQuitely: 'owner-message-public-send-quite',
    sendWithNotification: 'owner-message-public-send-notify',
    pinQuitely: 'owner-message-public-pin-quite',
    pinWithNotification: 'owner-message-public-pin-notify',
  },
  all: {
    sendQuitely: 'owner-message-all-send-quite',
    sendWithNotification: 'owner-message-all-send-notify',
    pinQuitely: 'owner-message-all-pin-quite',
    pinWithNotification: 'owner-message-all-pin-notify',
  },
};

type ChatType = keyof typeof ownerMessageSendingWay;
const ownerMessageSendingWayKeys = Object.keys(ownerMessageSendingWay) as ChatType[];
const setHandlerOnEveryChatType = (handler: (chatTypeKey: ChatType) => void) =>
  ownerMessageSendingWayKeys.forEach((key) => handler(key));

export const selectGroupTypeButtons: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('Публичные группы🔓', OwnerMessageActions.PUBLIC)],
  [Markup.button.callback('Приватные группы🔒', OwnerMessageActions.PRIVATE)],
  [Markup.button.callback('Все группы🔓🔒', OwnerMessageActions.ALL)],
];

const getSelectButtons = (chatType: ChatType) => [
  [Markup.button.callback('отправить🔕', ownerMessageSendingWay[chatType].sendQuitely)],
  [
    Markup.button.callback(
      'отправить🔔',
      ownerMessageSendingWay[chatType].sendWithNotification,
    ),
  ],
  [
    Markup.button.callback(
      'отправить и закрепить📌🔕',
      ownerMessageSendingWay[chatType].pinQuitely,
    ),
  ],
  [
    Markup.button.callback(
      'отправить и закрепить📌🔔',
      ownerMessageSendingWay[chatType].pinWithNotification,
    ),
  ],
];

export class OwnerMessageCommand extends Command {
  chats: number[] = [];
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
            },
          });
        }
      });
      //PRIVATE
      this.bot.action(OwnerMessageActions.PRIVATE, async (ctx) => {
        await ctx.deleteMessage();
        await ctx.reply('Отправить ваше сообщение...', {
          reply_markup: {
            inline_keyboard: getSelectButtons('private'),
          },
        });
        this.chats = await getPrivateChatsWhereBotEnabled();
      });
      //PUBLIC
      this.bot.action(OwnerMessageActions.PUBLIC, async (ctx) => {
        await ctx.deleteMessage();
        await ctx.reply('Отправить ваше сообщение...', {
          reply_markup: {
            inline_keyboard: getSelectButtons('public'),
          },
        });
        this.chats = await getPublicChatsWhereBotEnabled();
      });
      //ALL
      this.bot.action(OwnerMessageActions.ALL, async (ctx) => {
        await ctx.deleteMessage();
        await ctx.reply('Отправить ваше сообщение...', {
          reply_markup: {
            inline_keyboard: getSelectButtons('all'),
          },
        });
        this.chats = await getAllChatsWhereBotEnabled();
      });

      setHandlerOnEveryChatType((key) => {
        this.bot.action(ownerMessageSendingWay[key].sendQuitely, async (ctx) => {
          await sendMessageToChats({ ctx, chats: this.chats, message: ctx.session.ownerMessage });
        });
      });
      setHandlerOnEveryChatType((key) => {
        this.bot.action(ownerMessageSendingWay[key].sendWithNotification, async (ctx) => {
          await sendMessageToChats({
            ctx,
            chats: this.chats,
            message: ctx.session.ownerMessage,
            disableNotification: false,
          });
        });
      });
      setHandlerOnEveryChatType((key) => {
        this.bot.action(ownerMessageSendingWay[key].pinQuitely, async (ctx) => {
          await sendAndPinMessageToChats({
            ctx,
            chats: this.chats,
            message: ctx.session.ownerMessage,
          });
        });
      });
      setHandlerOnEveryChatType((key) => {
        this.bot.action(ownerMessageSendingWay[key].pinWithNotification, async (ctx) => {
          await sendAndPinMessageToChats({
            ctx,
            chats: this.chats,
            message: ctx.session.ownerMessage,
            disableNotification: false,
          });
        });
      });
    } catch (e) {
      logger.error(`In OwnerMessageCommand class ${getErrorMsg(e)}`);
    }
  }
}
