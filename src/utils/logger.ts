import bunyan from 'bunyan';
class Logger {
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }
}

export const logger: Logger = new Logger();

// To Use: paste in any file, change the name specific to each file
// import { logger } from '@utils/logger'
// import Logger from 'bunyan';
// const log: Logger = logger.createLogger('NameSetupServer')
