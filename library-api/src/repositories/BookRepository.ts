import { prisma } from "../database/prisma";
import { CreateBookDTO, UpdateBookDTO } from "../dtos/BookDTO";

export class BookRepository {
  // Cria um novo livro
  async create(data: CreateBookDTO) {
    return await prisma.book.create({
      data,
    });
  }

  // Busca todos os livros
  async findAll() {
    return await prisma.book.findMany();
  }

  // Busca por ID
  async findById(id: string) {
    return await prisma.book.findUnique({
      where: { id },
    });
  }

  // Busca por ISBN (usado para validar duplicidade no Service)
  async findByIsbn(isbn: string) {
    return await prisma.book.findUnique({
      where: { isbn },
    });
  }

  // Atualiza dados de um livro
  async update(id: string, data: UpdateBookDTO) {
    return await prisma.book.update({
      where: { id },
      data,
    });
  }
}