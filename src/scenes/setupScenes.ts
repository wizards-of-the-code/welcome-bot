import { Scenes } from 'telegraf';
import { BotContext } from '../contracts';
import { digitCaptchaWizardScene } from './digitCaptchaWizardScene';
import getBot from '../setupBot/setupBot';

export const setupScenes = () => {
  const stage = new Scenes.Stage<BotContext>([digitCaptchaWizardScene]);
  const bot = getBot();
  bot.use(stage.middleware());
};
