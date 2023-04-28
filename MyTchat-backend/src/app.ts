import express, { Express } from 'express';
import { MyTchatServer } from './setupServer';
import databaseConnection from './setupDatabase';

class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();
    const server: MyTchatServer = new MyTchatServer(app);
    server.start();
  }
}

const application = new Application();
application.initialize();
