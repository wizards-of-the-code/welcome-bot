import { Bot } from '../../contracts';
import { OwnerMessage } from '../../schemas/models';

/**
 * Saves owner message to database & cleans database
 * @param bot
 */
export const handleOwnerMessageSave = (bot: Bot) => {
  bot.action('owner-message-save', async (ctx, next) => {
    ctx.deleteMessage();
    ctx.reply(
      'Сообщение сохранено!\n\nОтправьте команду "\\owner_message", чтоб продолжить работу с сообщением...',
    );
    await new OwnerMessage({ message: ctx.session.ownerMessage }).save();
    await next();
  });
};

/**
 * Closes keyboard & cleans session
 * @param bot
 */
export const handleOwnerMessageCancel = (bot: Bot) => {
  bot.action('owner-message-cancel', async (ctx, next) => {
    ctx.deleteMessage();
    ctx.reply('Напишите еще раз, когда что-нибудь надумаете!');
    ctx.session.ownerMessage = '';
    await next();
  });
};
