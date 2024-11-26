import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
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
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});
export default router;
