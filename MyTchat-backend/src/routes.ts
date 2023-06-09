import { authRoutes } from '@auth/routes/authRoutes';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { commentRoutes } from '@comment/routes/commentRoutes';
import { followerRoutes } from '@follower/routes/followerRoute';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { postRoutes } from '@post/routes/postRoutes';
import { reactionRoutes } from '@reaction/routes/reactionRoute';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    app.use(BASE_PATH, authMiddleware.VerifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.VerifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.VerifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.VerifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.VerifyUser, followerRoutes.routes());

  };

  routes();
};
