import setupListeners from './listeners/setupListeners';
import connectToMongoose from './mongoose';
import setupCommands from './commands/setupCommands';
import { setupActions } from './actions/setupActions';

const main = () => {
  (async () => {
    await connectToMongoose();

    await setupCommands();
    setupActions();
    setupListeners();
  })();
};
main();
