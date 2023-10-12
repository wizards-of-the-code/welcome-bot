import { Command } from '../command.class';
import { CommandEnum } from '../types';
import logger from '../../logger/logger';
import { ChatSettings } from '../../schemas/models';
import { getErrorMsg } from '../../listeners/helpers/helpers';
import { setupChatSettings } from '../helpers/dbRequests';
import { hasObjectKey } from '../../helpers/helpers';

export class SetupGroupCommand extends Command {
  handle(): void {
    this.bot.command(CommandEnum.SETUP_GROUP, async (ctx) => {
      try {
        logger.info('Handling setup group command');
        const { chat, from } = ctx;
        if (!chat || !from || chat.type === 'private' || !ctx.message) return;

        const chatSettings = await ChatSettings.findOne({ chatId: chat.id });

        if (chatSettings?.botEnabled) {
          await ctx.reply('Bot is already activated');
          return;
        }
        const admins = await ctx.getChatAdministrators();
        const adminsIDs = admins.map((admin) => admin.user.id);
        const creator = admins.find((admin) => admin.status === 'creator');

        if (!adminsIDs.includes(from.id)) return;

        const isPrivateGroup = !hasObjectKey(chat, 'username');

        if (!chatSettings) {
          logger.info('Bot is activated');
          await setupChatSettings({
            chatTitle: chat.title,
            chatId: chat.id,
            chatType: chat.type,
            administrators: adminsIDs,
            botEnabled: true,
            isPrivateGroup,
            creator: creator
              ? {
                  id: creator.user.id,
                  username: creator.user.username,
                }
              : null,
          });
        } else if (chatSettings) {
          logger.info('Bot is re-activated');
          await chatSettings.updateOne({
            botEnabled: true,
            chatTitle: chat.title,
            chatType: chat.type,
            administrators: adminsIDs,
            isPrivateGroup,
          });
        }
        try {
          await ctx.deleteMessage(ctx.message.message_id);
        } catch (e) {
          logger.error(getErrorMsg(e));
        }
        await ctx.reply('Bot is activated');
      } catch (e) {
        logger.error(`While handling setup group command ${getErrorMsg(e)}`);
      }
    });
  }
}
