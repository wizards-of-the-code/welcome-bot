import { Composer, Scenes } from 'telegraf';
import { BotContext } from '../contracts';
import { message } from 'telegraf/filters';
import { welcomeNewMember } from '../middlewares/welcomeNewMember';
import logger from '../logger/logger';
import { customMention, escapeForMarkdown2 } from '../listeners/helpers/helpers';
import { banUser, generateCaptcha } from '../helpers/captcha';

export const captchaWizardID = 'CAPTCHA_WIZARD_SCENE_ID';
export const banTime = 24; //hours
const maxAttempt = 3;

export const generateDigitCaptcha = async (ctx: BotContext) => {
  const { session } = ctx.scene;
  const newMember = ctx.session.newChatMembers[0];
  const { message, answer } = generateCaptcha();
  session.captchaAnswer = answer;
  await ctx.replyWithMarkdownV2(
    customMention(newMember.username || newMember.first_name, newMember.id) +
      escapeForMarkdown2(`\n${message}\n\nLeft attempts - ${maxAttempt - session.counter}`),
  );
  session.counter = session.counter + 1;
};

const checkCaptchaAnswerWizard = new Composer<BotContext>();
checkCaptchaAnswerWizard.on(message('text'), async (ctx) => {
  const { text } = ctx.message;
  const { session } = ctx.scene;
  const isCorrect = session.captchaAnswer?.toString() === text;
  if (!isCorrect && maxAttempt > session.counter) {
    logger.warn('Captcha wizard, step back');
    await generateDigitCaptcha(ctx);
    return;
  } else if (!isCorrect && maxAttempt <= session.counter) {
    await banUser(ctx, ctx.session.newChatMembers[0].id, banTime);
    return ctx.scene.leave();
  } else if (isCorrect) {
    logger.info('Captcha is passed!!!');
    await welcomeNewMember(ctx);
    return ctx.scene.leave();
  }
});

export const digitCaptchaWizardScene = new Scenes.WizardScene<BotContext>(
  captchaWizardID,
  async (ctx) => {
    ctx.scene.session.counter = 1;
    await generateDigitCaptcha(ctx);
    return ctx.wizard.next();
  },
  checkCaptchaAnswerWizard,
);
