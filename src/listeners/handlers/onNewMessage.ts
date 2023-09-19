import { Bot } from '../../contracts';
import { message } from 'telegraf/filters';
import { escapeForMarkdown2, getErrorMsg, mention } from '../helpers/helpers';
import { ChatSettings } from '../../schemas/models';
import { FooterType } from '../../schemas/types';

/**
 * @param bot
 */
const onNewMessage = (bot: Bot) => {
  bot.on(message('text'), async (ctx) => {
    try {
      if (ctx && 'title' in ctx.chat) {
        const { title } = ctx.chat;
        const chatSettings = await ChatSettings.findOne({ chatTitle: title }).populate<FooterType>(
          'footer',
        );
        console.log(chatSettings?.footer.message);
        if (chatSettings) {
          const user = ctx.message.from;
          const newMemberMention = mention(
            escapeForMarkdown2(user.username ?? user.first_name),
            user.id,
          );

          const sentMessage = await ctx.sendMessage(`${newMemberMention} \n\nHello there`, {
            parse_mode: 'MarkdownV2',
          });
          await ChatSettings.updateOne(
            { chatTitle: title },
            {
              previousSentMessage: {
                chatId: sentMessage.chat.id,
                messageId: sentMessage.message_id,
              },
            },
          );
        }
      }
    } catch (e) {
      console.error(getErrorMsg(e));
    }
  });
};
export default onNewMessage;
