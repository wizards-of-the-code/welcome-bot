import { getAndDeleteItemFromArr } from './helpers';
import logger from '../logger/logger';
import { getTasks } from 'node-cron';

export type Task = {
  timerID: NodeJS.Timeout;
  userID: number;
};
export const taskManager = (() => {
  const tasks: Task[] = [];

  const addTask = (task: Task) => {
    tasks.push(task);
  };

  const getTaskIndex = (userID: number) => tasks.findIndex((task) => task.userID === userID);

  const hasTask = (userID: number) => getTaskIndex(userID) !== -1;

  const getAndRemoveTask = (userID: number) => {
    const taskToRemoveIndex = getTaskIndex(userID);
    if (taskToRemoveIndex === -1) {
      logger.warn('TASK NOT FOUND');
      return;
    }
    const taskToRemove = getAndDeleteItemFromArr<Task>(taskToRemoveIndex, tasks);
    return taskToRemove;
  };

  const stopTask = (userID: number) => {
    const taskToRemove = getAndRemoveTask(userID);
    if (!taskToRemove) return;
    clearTimeout(taskToRemove.timerID);
    logger.info('TASK STOPPED');
  };
  return { addTask, removeFinishedTask: getAndRemoveTask, stopTask, hasTask };
})();
