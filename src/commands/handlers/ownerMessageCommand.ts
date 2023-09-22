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
  'SEND' = 'owner-message-send',
  'PIN' = 'owner-message-pin',
  'NOTIFY' = 'owner-message-notify',
  'SAVE' = 'owner-message-save',
  'CANCEL' = 'owner-message-cancel',
}

export const buttons: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('во все группы', OwnerMessageActions.SEND)],
  [Markup.button.callback('с закреплением', OwnerMessageActions.PIN)],
  [Markup.button.callback('с уведомлением', OwnerMessageActions.NOTIFY)],
];

export const getChatsWhereBotEnabled = async (): Promise<number[]> => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true })
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
          await ctx.reply('Отправить ваше сообщение...', {
            reply_markup: {
              inline_keyboard: buttons,
            },
          });
        }
      });

      this.bot.action(OwnerMessageActions.SEND, async (ctx) => {
        const chats = await getChatsWhereBotEnabled();
        logger.info(JSON.stringify(chats));
        await sendMessageToChats({ ctx, chats, message: ctx.session.ownerMessage });
      });

      this.bot.action(OwnerMessageActions.NOTIFY, async (ctx) => {
        const chats = await getChatsWhereBotEnabled();
        await sendMessageToChats({
          ctx,
          chats,
          message: ctx.session.ownerMessage,
          disableNotification: false,
        });
      });

      this.bot.action(OwnerMessageActions.PIN, async (ctx) => {
        const chats = await getChatsWhereBotEnabled();
        await sendAndPinMessageToChats({ ctx, chats, message: ctx.session.ownerMessage });
      });
    } catch (e) {
      logger.error(`In OwnerMessageCommand class ${getErrorMsg(e)}`);
    }
  }
}
