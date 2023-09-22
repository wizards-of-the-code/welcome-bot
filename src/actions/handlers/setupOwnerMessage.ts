import { Bot } from '../../contracts';
import { OwnerMessage } from '../../schemas/models';
import configService from '../../config/ConfigService';
import logger from '../../logger/logger';
import { session } from 'telegraf';

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
    const ownerMessage = await OwnerMessage.findOne({
      ownerUsername: configService.get('OWNER_USERNAME'),
    });

    if (!ownerMessage) {
      await new OwnerMessage({ message: ctx.session.ownerMessage }).save();
    } else {
      await ownerMessage.updateOne({ message: ctx.session.ownerMessage });
    }
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
