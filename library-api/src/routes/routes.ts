import { Router } from 'express';
import { bookRouter } from './book.routes';
import { loanRouter } from './loan.routes';
import { userRouter } from './user.routes';

const router = Router();

router.use('/books', bookRouter);
router.use('/users', userRouter);
router.use('/loans', loanRouter);

export { router };