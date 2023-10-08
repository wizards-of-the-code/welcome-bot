import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import setupCommands from './commands/setupCommands';
import { setupActions } from './actions/setupActions';
import { setBotDescription } from './setupBot/setBotDescription';
import setupBot from './setupBot/setupBot';
import { setupScenes } from './scenes/setupScenes';

const main = () => {
  (async () => {
    await connectToMongoose();
    setupBot();
    setupScenes();
    await setBotDescription();
    await setupCommands();
    setupActions();
    setupListeners();
  })();
};
main();
