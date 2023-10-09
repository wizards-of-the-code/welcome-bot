import { Command } from '../command.class';
import { CommandEnum } from '../types';
import logger from '../../logger/logger';
import { ChatSettings } from '../../schemas/models';
import { getErrorMsg } from '../../listeners/helpers/helpers';
import { getAdminIDS } from '../../helpers/helpers';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import { CaptchaEnum } from '../../schemas/types';

export const selectCaptchaType: InlineKeyboardButton.CallbackButton[][] = [
  [Markup.button.callback('Digits', CaptchaEnum.DIGITS)],
  [Markup.button.callback('Image', CaptchaEnum.IMAGE)],
];

export class CaptchaCommand extends Command {
  handle(): void {
    try {
      this.bot.command(CommandEnum.CAPTCHA, async (ctx) => {
        logger.info('Set-upping captcha command');

        const { chat } = ctx;
        if (!chat || !ctx.from || chat.type === 'private') return;
        const chatSettings = await ChatSettings.findOne({ chatId: chat.id });
        const adminsIDs = await getAdminIDS(ctx);

        if (
          !chatSettings ||
          !chatSettings.botEnabled ||
          chatSettings.chatType === 'private' ||
          !adminsIDs.includes(ctx.from.id)
        ) {
          return;
        }

        await ctx.reply('Select captcha type', {
          reply_markup: {
            inline_keyboard: selectCaptchaType,
            one_time_keyboard: true
          },
        });

        this.bot.action(CaptchaEnum.DIGITS, async (context) => {
          if (!context || !context.from || !adminsIDs.includes(context.from.id)) return;
          logger.info(`Captcha ${CaptchaEnum.DIGITS} is set in chat ${chatSettings.chatTitle}`);
          await context.deleteMessage();
          await chatSettings.updateOne({ captcha: CaptchaEnum.DIGITS });
          await ctx.reply(`I'll use this type of test! (${CaptchaEnum.DIGITS})`);
        });

        this.bot.action(CaptchaEnum.IMAGE, async (context) => {
          if (!context || !context.from || !adminsIDs.includes(context.from.id)) return;
          logger.info(`Captcha ${CaptchaEnum.IMAGE} is set in chat ${chatSettings.chatTitle}`);
          await context.deleteMessage();
          await chatSettings.updateOne({ captcha: CaptchaEnum.IMAGE });
          await ctx.reply(`I'll use this type of test! (${CaptchaEnum.IMAGE})`);
        });
      });
    } catch (e) {
      logger.error(`While handling stop group command ${getErrorMsg(e)}`);
    }
  }
}
