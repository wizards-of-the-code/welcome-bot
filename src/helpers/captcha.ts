import { calculateUntilDate, getRandomInt, secondsToMs } from '../scenes/helpers';
import { BotContext } from '../contracts';
import logger from '../logger/logger';
import { customMention, escapeForMarkdown2, getErrorMsg } from '../listeners/helpers/helpers';
import { banTime } from '../scenes/digitCaptchaWizardScene';
import { taskManager } from './taskManager';

export const generateCaptcha = () => {
  const [firstNumber, secondNumber] = [getRandomInt(0, 20), getRandomInt(0, 20)];
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

export const generateCaptchaTask = async (ctx: BotContext, allowedTaskTime: number) => {
  const { session } = ctx;
  const { message, answer } = generateCaptcha();
  const newMember = session.newChatMembers[0];
  session.captchaAnswer = answer;
  await ctx.replyWithMarkdownV2(
    customMention(newMember.username || newMember.first_name, newMember.id) +
      escapeForMarkdown2(`\n${message}\n\nYou have ${allowedTaskTime} seconds to solve the task.`),
  );
  const task = setTimeout(async () => {
    logger.warn(
      `Time has passed, banning user ${
        newMember.username || newMember.first_name
      } for not answering`,
    );
    await banUser(ctx, newMember.id, banTime);
    taskManager.removeFinishedTask(session.newChatMembers[0].id);
  }, secondsToMs(allowedTaskTime));
  taskManager.addTask({ timerID: task, userID: session.newChatMembers[0].id });
};
