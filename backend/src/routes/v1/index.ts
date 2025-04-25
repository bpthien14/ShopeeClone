import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import orderRoute from './order.route';
import config from '../../config/config';
import cartRoute from './cart.route';
import { ProductRoutes } from './product.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/products',
    route: ProductRoutes,
  }
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
