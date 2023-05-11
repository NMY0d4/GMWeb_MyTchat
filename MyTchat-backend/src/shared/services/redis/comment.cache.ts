import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import Logger from 'bunyan';
import _, { find } from 'lodash';
import { BaseCache } from '@service/redis/base.cache';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/helpers';
import { ICommentDocument } from '@comment/interfaces/comment.interface';

const LOG_NAME = 'commentsCache';
const log: Logger = config.createLogger(LOG_NAME);

export class CommentCache extends BaseCache {
  constructor() {
    super(LOG_NAME);
  }

  public async savePostCommentToCache(postId: string, value: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.LPUSH(`comments: ${postId}`, value);
      const commentsCount: string[] = await this.client.HMGET(`posts:${postId}`, 'commentsCount');
      let count: number = Helpers.parseJson(commentsCount[0]) as number;
      count += 1;
      await this.client.HSET(`posts:${postId}`, 'commentsCount', `${count}`);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getCommentsFromCache(postId: string): Promise<ICommentDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const reply: string[] = await this.client.LRANGE(`comments: ${postId}`, 0, -1);
      const list: ICommentDocument[] = [];
      for (const item of reply) {
        list.push(Helpers.parseJson(item));
      }
      return list;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}
