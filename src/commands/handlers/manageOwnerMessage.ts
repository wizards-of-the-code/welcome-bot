import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { BotContext } from '../../contracts';
import config from '../../config/ConfigService';
import { Markup } from 'telegraf';
import { OwnerMessage } from '../../schemas/models';

export enum ManageOwnerMessage {
  'SEND' = 'owner-message-send',
  'PIN' = 'owner-message-pin',
  'NOTIFY' = 'owner-message-notify',
}

const buttons: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('во все группы', ManageOwnerMessage.SEND)],
  [Markup.button.callback('с закреплением', ManageOwnerMessage.PIN)],
  // [Markup.button.callback('с уведомлением', ManageOwnerMessage.NOTIFY)],
];
export const manageOwnerMessage = async (ctx: BotContext) => {
  if (!ctx.from || !ctx.from.username || ctx.chat?.type !== 'private') return;
  const { from } = ctx;
  if (config.get('OWNER_USERNAME') !== from.username) return;

  const ownerMessage = await OwnerMessage.findOne({ ownerUsername: from?.username })
    .select('message')
    .lean();

  if (!ownerMessage || !ownerMessage.message) {
    await ctx.reply(
      'Сообщение еще не задано, чтоб задать сообщение, просто напишите мне любой текст',
    );
  } else {
    await ctx.reply(`Отправить ваше сообщение...`, {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }
};
