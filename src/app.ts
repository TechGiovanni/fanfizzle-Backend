import express, { Express } from 'express';
import { FanFizzleServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@utils/config';

class Application {
  public start(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: FanFizzleServer = new FanFizzleServer(app);

    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.start();
