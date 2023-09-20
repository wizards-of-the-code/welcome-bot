import { BotContext } from '../../contracts';
import { ChatSettings } from '../../schemas/models';
import logger from '../../logger/logger';

const stopGroup = async (ctx: BotContext) => {
  const { chat } = ctx;
  if (!chat || !ctx.from) return;

  const chatSettings = await ChatSettings.findOne({ chatId: chat.id });

  if (
    !chatSettings ||
    !chatSettings.botEnabled ||
    chatSettings.chatType !== 'private' ||
    ctx.from.id !== chatSettings.creator.id
  ) {
    return;
  }

  logger.info(`Bot is disabled for chat ${chatSettings.chatTitle}`);
  await chatSettings.updateOne({ botEnabled: false });
};

export default stopGroup;
