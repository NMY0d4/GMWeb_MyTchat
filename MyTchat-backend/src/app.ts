import express, { Express } from 'express';

import { MyTchatServer } from './setupServer';

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: MyTchatServer = new MyTchatServer(app);
    server.start();
  }
}

const application = new Application();
application.initialize();
