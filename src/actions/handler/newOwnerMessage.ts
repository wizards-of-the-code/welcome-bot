import { OwnerMessageActions } from '../../commands/handlers/ownerMessageCommand';
import configService from '../../config/ConfigService';
import { OwnerMessage } from '../../schemas/models';
import getBot from '../../setupBot';

const bot = getBot();

export const saveNewOwnerMessage = () => {
  bot.action(OwnerMessageActions.SAVE, async (ctx) => {
    ctx.deleteMessage();
    ctx.reply(
      'Сообщение сохранено!\n\nОтправьте команду /owner_message", чтоб продолжить работу с сообщением...',
    );
    const ownerMessage = await OwnerMessage.findOne({
      ownerUsername: configService.get('OWNER_USERNAME'),
    });

    if (!ownerMessage) {
      await new OwnerMessage({ message: ctx.session.ownerMessage }).save();
    } else {
      await ownerMessage.updateOne({ message: ctx.session.ownerMessage });
    }
  });
};

export const cancelNewOwnerMessage = () => {
  bot.action(OwnerMessageActions.CANCEL, async (ctx, next) => {
    ctx.deleteMessage();
    ctx.reply('Напишите еще раз, когда что-нибудь надумаете!');
    ctx.session.ownerMessage = '';
    await next();
  });
};
