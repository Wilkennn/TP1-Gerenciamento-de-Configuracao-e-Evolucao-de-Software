import { Request, Response } from "express";
import { BookService } from "../services/BookService";
import { CreateBookDTO, UpdateBookDTO } from "../dtos/BookDTO";

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  // POST /books
  async create(req: Request, res: Response) {
    try {
      // Dica: Aqui você poderia validar se title e isbn existem antes de chamar o service
      const data: CreateBookDTO = req.body;
      const book = await this.bookService.create(data);
      return res.status(201).json(book);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /books
  async getAll(req: Request, res: Response) {
    try {
      const books = await this.bookService.findAll();
      return res.status(200).json(books);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // GET /books/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await this.bookService.findById(id);
      return res.status(200).json(book);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /books/:id
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateBookDTO = req.body;
      const updatedBook = await this.bookService.update(id, data);
      return res.status(200).json(updatedBook);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}