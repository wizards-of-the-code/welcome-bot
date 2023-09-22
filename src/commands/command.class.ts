import { Bot } from '../contracts';

export abstract class Command {
  constructor(public bot: Bot) {}

  abstract handle(): void;
}
