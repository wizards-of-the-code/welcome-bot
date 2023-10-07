import config from '../../config/ConfigService';
import { MessageUpdate } from '../../contracts';
import { OwnerMessageAction } from '../../commands/handlers/ownerMessageCommand';

const buttons = [
  [
    { text: 'Сохранить', callback_data: OwnerMessageAction.SAVE },
    { text: 'Отмена', callback_data: OwnerMessageAction.CANCEL },
  ],
];

export const onOwnerMessage = async (ctx: MessageUpdate) => {
  if (!ctx.from || !ctx.message || !ctx.from.username || ctx.chat?.type !== 'private') return;
  const { message, from } = ctx;

  if (config.get('OWNER_USERNAME') !== from.username) return;

  ctx.session.ownerMessage = message.text;

  await ctx.reply(`Сохранить ваше сообщение?\n\n${message.text}`, {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
};
