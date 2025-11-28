import { Router } from 'express';
import { LoanController } from '../controllers/LoanController';

const loanRouter = Router();
const loanController = new LoanController();

loanRouter.post('/', (req, res) => loanController.create(req, res));
loanRouter.post('/:id/return', (req, res) => loanController.returnBook(req, res));
loanRouter.get('/overdue', (req, res) => loanController.getOverdueLoans(req, res));

export { loanRouter };