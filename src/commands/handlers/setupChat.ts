import { BotContext } from '../../contracts';
import { ChatSettings } from '../../schemas/models';

const setupChat = async (ctx: BotContext) => {
  const { chat } = ctx;
  if (!chat || !ctx.from) return;

  const chatSettings = await ChatSettings.findOne({ chatId: chat.id });

  if (
    !chatSettings
    || chatSettings.botEnabled
    || chatSettings.administrators.includes(ctx.from.id.toString())
  ) {
    return;
  }

  await chatSettings.updateOne({ botEnabled: true });
};

export default setupChat;
