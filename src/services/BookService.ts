import { BookRepository } from "../repositories/BookRepository";
import { CreateBookDTO, UpdateBookDTO } from "../dtos/BookDTO";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async create(data: CreateBookDTO) {
    // Regra: ISBN é único
    const bookExists = await this.bookRepository.findByIsbn(data.isbn);

    if (bookExists) {
      throw new Error("Já existe um livro cadastrado com este ISBN.");
    }

    return await this.bookRepository.create(data);
  }

  async findAll() {
    return await this.bookRepository.findAll();
  }

  async findById(id: string) {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error("Livro não encontrado.");
    }
    return book;
  }

  async update(id: string, data: UpdateBookDTO) {
    // Verifica se o livro existe antes de tentar atualizar
    await this.findById(id);
    
    return await this.bookRepository.update(id, data);
  }
}