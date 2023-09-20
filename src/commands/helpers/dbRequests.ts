import { CreatorType, FooterType } from '../../schemas/types';
import { ChatSettings, Footer, MigratedChatMessages } from '../../schemas/models';
import { FooterTitles } from '../../contracts';
import { escapeForMarkdown2 } from '../../listeners/helpers/helpers';
import { defaultWelcomeMessage } from '../../constants';

export type SetupChatSettingsParams = {
  chatId: number;
  chatTitle: string;
  chatType: string;
  administrators: number[];
  creator: CreatorType;
  botEnabled?: boolean
};

/**
 * Creates required collections in database;
 * @param {SetupChatSettingsParams}
 */
export const setupChatSettings = async ({
  chatId,
  chatTitle,
  chatType,
  administrators,
  creator,
  botEnabled = false
}: SetupChatSettingsParams) => {
  const footer = (await Footer.findOne({ title: FooterTitles.STANDARD }).lean()) as FooterType;

  const migratedData = await MigratedChatMessages.findOne({ telegram_id: chatId })
    .select('wm')
    .lean();

  await new ChatSettings({
    message: migratedData ? migratedData.wm : escapeForMarkdown2(defaultWelcomeMessage),
    chatTitle,
    chatId,
    chatType,
    administrators,
    creator,
    footer,
    botEnabled
  }).save();
};
