import express, { Express } from 'express';
import { MyTchatServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: MyTchatServer = new MyTchatServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfing();
  }
}

const application = new Application();
application.initialize();
