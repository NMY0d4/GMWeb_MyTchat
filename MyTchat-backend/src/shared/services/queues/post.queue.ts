import { postWorker } from '@worker/post.worker';
import { BaseQueue } from './base.queue';
import { IPostJobData } from '@post/interfaces/post.interface';

class PostQueue extends BaseQueue {
  constructor() {
    super('posts');
    this.processJob('addPostToDB', 5, postWorker.SavePostToDB);
    this.processJob('deletePostFromDB', 5, postWorker.DeletePostFromDB);
    this.processJob('updatePostInDB', 5, postWorker.UpdatePostInDB);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export const postQueue: PostQueue = new PostQueue();
