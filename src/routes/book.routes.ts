import { Router } from 'express';
import { BookController } from '../controllers/BookController';

const bookRouter = Router();
const bookController = new BookController();

// Mapeamento das rotas para os métodos do controller
bookRouter.post('/', (req, res) => bookController.create(req, res));
bookRouter.get('/', (req, res) => bookController.getAll(req, res));
bookRouter.get('/:id', (req, res) => bookController.getById(req, res));
bookRouter.put('/:id', (req, res) => bookController.update(req, res));

export { bookRouter };