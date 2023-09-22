import { Command } from '../command.class';
import { CommandEnum } from '../types';
import logger from '../../logger/logger';
import { ChatSettings } from '../../schemas/models';
import { getErrorMsg } from '../../listeners/helpers/helpers';

export class StopGroupCommand extends Command {
  handle(): void {
    try {
      this.bot.command(CommandEnum.STOP_GROUP, async (ctx) => {
        logger.info('Handling stop group command');

        const { chat } = ctx;
        if (!chat || !ctx.from) return;

        const chatSettings = await ChatSettings.findOne({ chatId: chat.id });

        if (
          !chatSettings ||
          !chatSettings.botEnabled ||
          chatSettings.chatType === 'private' ||
          ctx.from.id !== chatSettings.creator.id
        ) {
          return;
        }

        logger.info(`Bot is disabled for ${chatSettings.chatTitle}`);
        await chatSettings.updateOne({ botEnabled: false });
        await ctx.deleteMessage(ctx.message.message_id);
        await ctx.reply('Bot is disabled');
      });
    } catch (e) {
      logger.error(`While handling stop group command ${getErrorMsg(e)}`);
    }
  }
}
