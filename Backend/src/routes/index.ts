import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import historyRouter from './history.route';
import bettingRouter from './betting.route';
const router = Router();
const routes = [
    {
        path: '/user',
        route: userRouter,
    },
    {
        path: '/auth',
        route: authRouter,
    },
    {
        path: '/betting',
        route: bettingRouter,
    },
    {
        path: '/history',
        route: historyRouter,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});
export default router;
