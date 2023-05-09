import { BaseQueue } from './base.queue';

import { IReactionJob } from '@reaction/interfaces/reaction.interface';

class ReactionQueue extends BaseQueue {
  constructor() {
    super('reactions');
    // this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }

  public addReactionJob(name: string, data: IReactionJob): void {
    this.addJob(name, data);
  }
}

export const reactionQueue: ReactionQueue = new ReactionQueue();
