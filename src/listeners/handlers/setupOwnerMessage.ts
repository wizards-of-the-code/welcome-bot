import { MessageUpdate } from '../../contracts';
import config from '../../config/ConfigService';
import commands from '../../commands/commands';

export const setupOwnerMessage = async (ctx: MessageUpdate) => {
  if (!ctx.from || !ctx.message || !ctx.from.username || ctx.chat?.type !== 'private') return;
  const { message, from } = ctx;

  if (message.text.startsWith('/')) return;
  if (config.get('OWNER_USERNAME') !== from.username) return;

  ctx.session.ownerMessage = message.text;

  await ctx.reply(`Сохранить ваще сообщение?\n\n${message.text}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Сохранить', callback_data: 'owner-message-save' },
          { text: 'Отмена', callback_data: 'owner-message-cancel' },
        ],
      ],
    },
  });

};
