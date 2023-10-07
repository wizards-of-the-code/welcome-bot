import {ChatSettingsType, FooterType} from '../../schemas/types';
import { ChatSettings, Footer, MigratedChatMessages } from '../../schemas/models';
import { FooterTitles } from '../../contracts';
import { escapeForMarkdown2 } from '../../listeners/helpers/helpers';
import { defaultWelcomeMessage } from '../../constants';

export type SetupChatSettingsParams = Omit<ChatSettingsType, 'createdAt' | 'updatedAt' | '_id' | 'footer' | 'message'>;

/**
 * Creates required collections in database;
 * @param {SetupChatSettingsParams}
 */
export const setupChatSettings = async ({
  chatId,
  botEnabled = false,
  ...rest
}: SetupChatSettingsParams) => {
  const footer = (await Footer.findOne({ title: FooterTitles.STANDARD }).lean()) as FooterType;
  const migratedData = await MigratedChatMessages.findOne({ telegram_id: chatId })
    .select('wm')
    .lean();
  await new ChatSettings({
    ...rest,
    message: migratedData ? migratedData.wm : escapeForMarkdown2(defaultWelcomeMessage),
    chatId,
    footer,
    botEnabled,
  }).save();
};
export const getAllChatsWhereBotEnabled = async (): Promise<number[]> => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true })
    .select('chatId')
    .lean();
  return chatSettings.map((chat) => chat.chatId);
};

export const getPrivateChatsWhereBotEnabled = async (): Promise<number[]> => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true, isPrivateGroup: true })
    .select('chatId')
    .lean();
  return chatSettings.map((chat) => chat.chatId);
};

export const getPublicChatsWhereBotEnabled = async (): Promise<number[]> => {
  const chatSettings = await ChatSettings.find()
    .where({ botEnabled: true, isPrivateGroup: false })
    .select('chatId')
    .lean();
  return chatSettings.map((chat) => chat.chatId);
};
