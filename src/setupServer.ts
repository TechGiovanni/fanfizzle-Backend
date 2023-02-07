import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import { config } from '@utils/config';
const PORT = config.SERVER_PORT;
import routes from '@routes/routes';
import http from 'http';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import 'express-async-errors';
import HTTP_STATUS from 'http-status-codes';
import cookieSession from 'cookie-session';
import compression from 'compression';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';
import { logger } from '@utils/logger';
import Logger from 'bunyan';
const log: Logger = logger.createLogger('SetupServer');

export class FanFizzleServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.COOKIE_KEY_ONE!, config.COOKIE_KEY_TWO!],
        maxAge: 7 * 24 * 3600000,
        secure: false,
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['Get', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }
  private routesMiddleware(app: Application): void {
    routes(app);
  }
  private globalErrorHandler(app: Application): void {
    // catch endpoints that doesn't exist
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
      next();
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`process ${process.pid}`);

    httpServer.listen(PORT, () => {
      log.info(`server listening on port ${PORT}`);
    });
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['Get', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      },
    });

    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private socketIOConnections(io: Server): void {}
}
