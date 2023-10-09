import { Scenes } from 'telegraf';
import { BotContext } from '../contracts';
import { captchaWizardScene } from './captchaWizardScene';
import getBot from '../setupBot/setupBot';

export const setupScenes = () => {
  const stage = new Scenes.Stage<BotContext>([captchaWizardScene]);
  const bot = getBot();
  bot.use(stage.middleware());
};
