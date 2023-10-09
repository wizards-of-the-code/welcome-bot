import { calculateUntilDate, getRandomInt, secondsToMs } from '../scenes/helpers';
import { BotContext } from '../contracts';
import logger from '../logger/logger';
import { customMention, escapeForMarkdown2, getErrorMsg } from '../listeners/helpers/helpers';
import { banTime } from '../scenes/captchaWizardScene';
import { taskManager } from './taskManager';
import { deleteMessage } from './helpers';
import { User } from '@telegraf/types';
import { CaptchaEnum } from '../schemas/types';

const maxAttempt = 3;
const allowedTaskTime = 60; //sec

export const generateDigitCaptcha = () => {
  const [firstNumber, secondNumber] = [getRandomInt(0, 11), getRandomInt(0, 20)];
  return {
    answer: firstNumber + secondNumber,
    message: `What is the result of ${firstNumber} + ${secondNumber}?`,
  };
};

export const banUser = async (ctx: BotContext, userToBan: number, banTime: number) => {
  if (!ctx.chat || ctx.chat.type === 'private') return;
  try {
    await ctx.telegram.banChatMember(ctx.chat.id, userToBan, calculateUntilDate(banTime));
    logger.warn(`USER - id-${userToBan} is banned for ${banTime}h in chat - ${ctx.chat.title}`);
  } catch (e) {
    logger.error(getErrorMsg(e));
  }
};

export type GenerateCaptchaTaskParams = {
  ctx: BotContext;
  user: User;
  taskDeadline?: number;
};

export const generateDigitCaptchaTask = async ({
  ctx,
  taskDeadline = allowedTaskTime,
  user,
}: GenerateCaptchaTaskParams) => {
  const { message: captchaMessage, answer } = generateDigitCaptcha();
  ctx.session.captchaAnswer = answer.toString();
  const captcha = await ctx.replyWithMarkdownV2(
    customMention(user.username || user.first_name, user.id) +
      escapeForMarkdown2(
        `\n${captchaMessage}\n\nLeft attempts - ${
          maxAttempt - ctx.session.counter
        }.\n\nYou have ${taskDeadline} seconds for each attempt to solve the task.
        \nIf you don't send answer during any of the attempts you will be kicked from the chat and banned for ${banTime}h.`,
      ),
  );
  const task = setTimeout(async () => {
    logger.warn(
      `Time has passed, banning user ${user.username || user.first_name} for not answering`,
    );
    taskManager.removeFinishedTask(user.id);
    await deleteMessage(ctx, captcha.chat.id, captcha.message_id);
    await ctx.replyWithMarkdownV2(
      `${customMention(user.username || user.first_name, user.id)}\\, bye\\!`,
    );
    await banUser(ctx, user.id, banTime);
  }, secondsToMs(taskDeadline));

  taskManager.addTask({
    timerID: task,
    userID: user.id,
    chatID: captcha.chat.id,
    messageID: captcha.message_id,
  });
  ctx.session.counter = ctx.session.counter + 1;
};

export const generateCaptchaTask = async (params: GenerateCaptchaTaskParams) => {
  switch (params.ctx.session.captcha) {
    case CaptchaEnum.DIGITS:
      logger.info('Generating digit captcha');
      await generateDigitCaptchaTask(params);
      break;

    case CaptchaEnum.IMAGE:
      logger.info('Generating image captcha');
      await generateDigitCaptchaTask(params);
      break;
    default:
      logger.warn(`Captcha not found, captcha - ${params.ctx.session.captcha}`);
  }
};
