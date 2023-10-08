import { Composer, Scenes } from 'telegraf';
import { BotContext } from '../contracts';
import { message } from 'telegraf/filters';
import { welcomeNewMember } from '../middlewares/welcomeNewMember';
import logger from '../logger/logger';
import { banUser, generateDigitCaptchaTask } from '../helpers/captcha';
import { taskManager } from '../helpers/taskManager';
import { deleteMessage } from '../helpers/helpers';
import { customMention } from '../listeners/helpers/helpers';

export const captchaWizardID = 'CAPTCHA_WIZARD_SCENE_ID';
export const banTime = 24; //hours
const maxAttempt = 3;

const checkCaptchaAnswerWizard = new Composer<BotContext>();
checkCaptchaAnswerWizard.on(message('text'), async (ctx) => {
  const { text } = ctx.message;
  const { session } = ctx.scene;
  const isCorrect = session.captchaAnswer === text;
  if (!isCorrect && maxAttempt > session.counter) {
    logger.warn('Captcha wizard, step back');
    await taskManager.stopTask(ctx);
    await deleteMessage(ctx, ctx.chat.id, ctx.message.message_id);

    await generateDigitCaptchaTask({ ctx, session: ctx.scene.session, user: ctx.from });
    return;
  } else if (!isCorrect && maxAttempt <= session.counter) {
    await taskManager.stopTask(ctx);
    await deleteMessage(ctx, ctx.chat.id, ctx.message.message_id);
    await ctx.replyWithMarkdownV2(
      `${customMention(ctx.from.username || ctx.from.first_name, ctx.from.id)}\\, bye\\!`,
    );
    await banUser(ctx, ctx.from.id, banTime);
    return ctx.scene.leave();
  } else if (isCorrect) {
    await taskManager.stopTask(ctx);
    await deleteMessage(ctx, ctx.chat.id, ctx.message.message_id);

    logger.info('Captcha is passed!!!');
    await welcomeNewMember(ctx);
    return ctx.scene.leave();
  }
});

export const digitCaptchaWizardScene = new Scenes.WizardScene<BotContext>(
  captchaWizardID,
  async (ctx) => {
    if (!ctx.from) return;
    ctx.scene.session.counter = 1;
    await generateDigitCaptchaTask({ ctx, session: ctx.scene.session, user: ctx.from });
    return ctx.wizard.next();
  },
  checkCaptchaAnswerWizard,
);
