import mongoose from 'mongoose';
import { config } from '@utils/config';
import { logger } from '@utils/logger';
import Logger from 'bunyan';
const log: Logger = logger.createLogger('Setup Database');

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
      .connect(`${config.MONGODB_URL}`)
      .then(() => {
        log.info('successfully connected to mongoDB');
      })
      .catch(error => {
        log.info(`Error connecting to mongoDB: ${error}`);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnect', connect);
};
