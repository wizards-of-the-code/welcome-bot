import { MessageUpdate } from '../../contracts';
import logger from '../../logger/logger';
import { taskManager } from '../../helpers/taskManager';
import { captchaWizardID } from '../../scenes/captchaWizardScene';
import { deleteMessage } from '../../helpers/helpers';

export const onNewChatMemberText = async (ctx: MessageUpdate) => {
  const { chat, session, message } = ctx;
  if (chat.type === 'private' || !taskManager.hasTask(ctx.from.id) || !message.text.length) return;
  await taskManager.stopTask(ctx);
  await deleteMessage(ctx, chat.id, message.message_id);
  if (message.text === session.captchaAnswer) {
    logger.info('Captcha passed');
    return;
  }
  logger.warn('Captcha failed, starting captcha wizard scene');
  // start wizard scenes
  await ctx.scene.enter(captchaWizardID);
};
