import { MessageUpdate } from '../../contracts';
import logger from '../../logger/logger';
import { taskManager } from '../../helpers/taskManager';
import { captchaWizardID } from '../../scenes/captchaWizardScene';
import { deleteMessage } from '../../helpers/helpers';
import { welcomeNewMember } from '../../middlewares/welcomeNewMember';

export const onNewChatMemberText = async (ctx: MessageUpdate) => {
  const { chat, session, message } = ctx;
  if (chat.type === 'private' || !taskManager.hasTask(ctx.from.id) || !message.text.length) return;
  await taskManager.stopTask(ctx);
  await deleteMessage(ctx, chat.id, message.message_id);
  if (message.text.toLocaleLowerCase() === session.captchaAnswer) {
    logger.info('Captcha passed');
    await welcomeNewMember(ctx);
  } else {
    logger.warn('Captcha failed, starting captcha wizard scene');

    // start wizard scenes
    ctx.session.counter = 1;
    logger.warn(ctx.session.captcha);
    await ctx.scene.enter(captchaWizardID);
  }
};
