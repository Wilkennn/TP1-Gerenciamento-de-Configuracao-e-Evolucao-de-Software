import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', (req, res) => userController.create(req, res));
userRouter.get('/', (req, res) => userController.getAll(req, res));
userRouter.get('/:id', (req, res) => userController.getById(req, res));

export { userRouter };