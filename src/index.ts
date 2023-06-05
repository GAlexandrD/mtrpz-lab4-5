import { App } from './app';
import { db, parserService, taskController } from './singletons';

const start = async () => {
  const app = new App(taskController, parserService);

  await db.open();

  app.run();
};

start();
