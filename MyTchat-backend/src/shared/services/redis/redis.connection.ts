import Logger from 'bunyan';
import { config } from '@root/config';
import { BaseCache } from '@service/redis/base.cache';

const LOG_NAME = 'redisConnection';
const log: Logger = config.createLogger(LOG_NAME);

class RedisConnection extends BaseCache {
  constructor() {
    super(LOG_NAME);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (err) {
      log.error(err);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
