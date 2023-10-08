import { deleteMessage, getAndDeleteItemFromArr } from './helpers';
import logger from '../logger/logger';
import { BotContext } from '../contracts';

export type Task = {
  timerID: NodeJS.Timeout;
  userID: number;
  chatID: number;
  messageID: number;
};
export const taskManager = (() => {
  const tasks: Task[] = [];

  const addTask = (task: Task) => {
    tasks.push(task);
  };

  const getTaskIndex = (userID: number) => tasks.findIndex((task) => task.userID === userID);

  const hasTask = (userID: number) => getTaskIndex(userID) !== -1;
  const getTask = (userID: number) => tasks[getTaskIndex(userID)];

  const getAndRemoveTask = (userID: number) => {
    const taskToRemoveIndex = getTaskIndex(userID);
    if (taskToRemoveIndex === -1) {
      logger.warn('TASK NOT FOUND');
      return;
    }
    const taskToRemove = getAndDeleteItemFromArr<Task>(taskToRemoveIndex, tasks);
    return taskToRemove;
  };

  const stopTask = async (ctx: BotContext) => {
    const { from } = ctx;
    if (!from) return;
    const taskToRemove = getAndRemoveTask(from.id);
    if (!taskToRemove) return;
    clearTimeout(taskToRemove.timerID);
    await deleteMessage(ctx, taskToRemove.chatID, taskToRemove.messageID);
    logger.info('TASK STOPPED');
  };
  return { addTask, removeFinishedTask: getAndRemoveTask, stopTask, hasTask, getTask };
})();
