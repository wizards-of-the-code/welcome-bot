import { secondsToMs } from '../scenes/helpers';
import { BotContext } from '../contracts';
import logger from '../logger/logger';
import { customMention } from '../listeners/helpers/helpers';
import { banTime } from '../scenes/captchaWizardScene';
import { taskManager } from '../helpers/taskManager';
import { banUser, deleteMessage } from '../helpers/helpers';
import { Message, User } from '@telegraf/types';
import { CaptchaEnum } from '../schemas/types';
import { ChatSettings } from '../schemas/models';
import {
  generateDigitCaptcha,
  generateImageCaptcha,
  getDigitCaptchaMessage,
  getImageCaptchaMessage,
} from './creators';

const maxAttempt = 3;
const allowedTaskTime = 60; //sec

export type GenerateCaptchaTaskParams = {
  ctx: BotContext;
  user: User;
  taskDeadline?: number;
  sentCaptcha: Message.TextMessage | Message.PhotoMessage;
};

export const generateCaptchaTask = async ({
  ctx,
  taskDeadline = allowedTaskTime,
  user,
  sentCaptcha,
}: GenerateCaptchaTaskParams) => {
  const task = setTimeout(async () => {
    logger.warn(
      `Time has passed, banning user ${user.username || user.first_name} for not answering`,
    );
    taskManager.removeFinishedTask(user.id);
    await deleteMessage(ctx, sentCaptcha.chat.id, sentCaptcha.message_id);
    const message = await ctx.replyWithMarkdownV2(
      `${customMention(user.username || user.first_name, user.id)}\\, bye\\!`,
    );
    await banUser(ctx, user.id, banTime);
    await ChatSettings.updateOne(
      { chatId: message.chat.id },
      {
        previousSentMessage: {
          chatId: message.chat.id,
          messageId: message.message_id,
        },
      },
    );
    await ctx.scene.leave();
  }, secondsToMs(taskDeadline));

  taskManager.addTask({
    timerID: task,
    userID: user.id,
    chatID: sentCaptcha.chat.id,
    messageID: sentCaptcha.message_id,
  });
  ctx.session.counter = ctx.session.counter + 1;
};

export const sendCaptcha = async (params: Omit<GenerateCaptchaTaskParams, 'sentCaptcha'>) => {
  switch (params.ctx.session.captcha) {
    case CaptchaEnum.DIGITS:
      logger.info('Generating digit captcha');
      const { captcha: captchaDigits, answer } = generateDigitCaptcha();
      params.ctx.session.captchaAnswer = answer.toString();
      const captcha = await params.ctx.reply(
        getDigitCaptchaMessage({
          user: params.user,
          leftAttempts: maxAttempt - params.ctx.session.counter,
          banTime: banTime,
          taskDeadline: allowedTaskTime,
          ...captchaDigits,
        }),
      );
      await generateCaptchaTask({ ...params, sentCaptcha: captcha });
      break;

    case CaptchaEnum.IMAGE:
      logger.info('Generating image captcha');
      const { captcha: captchaInputFile, answer: captchaImageAnswer } = generateImageCaptcha();
      params.ctx.session.captchaAnswer = captchaImageAnswer || '';
      const imageCaptcha = await params.ctx.replyWithPhoto(captchaInputFile, {
        caption: getImageCaptchaMessage({
          user: params.user,
          leftAttempts: maxAttempt - params.ctx.session.counter,
          banTime: banTime,
          taskDeadline: allowedTaskTime,
        }),
      });
      await generateCaptchaTask({ ...params, sentCaptcha: imageCaptcha });
      break;
    default:
      logger.warn(`Captcha not found, captcha - ${params.ctx.session.captcha}`);
  }
};
