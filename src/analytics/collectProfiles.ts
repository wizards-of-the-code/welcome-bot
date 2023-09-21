import { MessageUpdate } from '../contracts';
import { ChatSettings, Profile } from '../schemas/models';
import logger from '../logger/logger';
import { getAllTags } from './helpers';

export const collectTags = async (ctx: MessageUpdate) => {
  if (!ctx.from || !ctx.message || !ctx.chat || ctx.chat.type === 'private') return;
  const { message, from, chat } = ctx;
  const chatSettings = await ChatSettings.findOne({ chatId: chat.id })
    .select('chatId botEnabled')
    .lean();
  if (!chatSettings || !chatSettings.botEnabled) return;

  const profile = await Profile.findOne({ userId: from.id });

  const tags = getAllTags(message.text);
  if (!tags) return;

  if (profile) {
    logger.info(`Profile of user - ${from.username || from.first_name} is updated`);
    const jointTags = new Set([...profile.tags, ...tags]);
    await profile.updateOne({ tags: [...jointTags] });
  } else {
    logger.info(`Profile for user - ${from.username || from.first_name} is created`);
    await new Profile({
      userId: from.id,
      username: from.username,
      firstname: from.first_name,
      tags,
      chatId: chat.id,
    }).save();
  }
};
