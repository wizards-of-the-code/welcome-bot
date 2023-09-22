import { Command } from '../command.class';
import { CommandEnum } from '../types';
import logger from '../../logger/logger';
import { ChatSettings } from '../../schemas/models';
import { getErrorMsg } from '../../listeners/helpers/helpers';
import { setupChatSettings } from '../helpers/dbRequests';

export class SetupGroupCommand extends Command {
  handle(): void {
    this.bot.command(CommandEnum.SETUP_GROUP, async (ctx) => {
      try {
        logger.info('Handling setup group command');
        const { chat, from } = ctx;
        if (!chat || !from || !('title' in chat) || !ctx.message) return;

        const chatSettings = await ChatSettings.findOne({ chatId: chat.id });

        if (chatSettings?.botEnabled) return;

        const admins = await ctx.getChatAdministrators();
        const adminsIDs = admins.map((admin) => admin.user.id);
        const creator = admins.find((admin) => admin.status === 'creator');

        if (!creator || !creator.user.username || from.id !== creator.user.id) {
          return;
        }

        if (!chatSettings) {
          logger.info('Bot is activated');
          await setupChatSettings({
            chatTitle: chat.title,
            chatId: chat.id,
            chatType: chat.type,
            administrators: adminsIDs,
            botEnabled: true,
            creator: { id: creator.user.id, username: creator.user.username },
          });
        } else if (chatSettings) {
          logger.info('Bot is activated');
          await chatSettings.updateOne({
            botEnabled: true,
            chatTitle: chat.title,
            chatType: chat.type,
            administrators: adminsIDs,
          });
        }
        await ctx.deleteMessage(ctx.message.message_id);
        await ctx.reply('Bot is activated');
      } catch (e) {
        logger.error(`While handling setup group command ${getErrorMsg(e)}`);
      }
    });
  }
}
