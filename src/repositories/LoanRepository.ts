import { prisma } from "../database/prisma";

export class LoanRepository {
  // Cria o empréstimo vinculando User e Book
  async create(userId: string, bookId: string, dueDate: Date) {
    return await prisma.loan.create({
      data: {
        userId,
        bookId,
        dueDate,
        // loanDate é preenchido automaticamente pelo @default(now()) no schema
      },
    });
  }

  // Busca empréstimo pelo ID trazendo os dados do Livro e do Usuário juntos
  async findById(id: string) {
    return await prisma.loan.findUnique({
      where: { id },
      include: {
        book: true, // Traz os detalhes do livro
        user: true, // Traz os detalhes do usuário
      },
    });
  }

  // Atualiza a data de devolução (Finaliza o empréstimo)
  async updateReturnDate(id: string, returnDate: Date) {
    return await prisma.loan.update({
      where: { id },
      data: { returnDate },
    });
  }

  // Busca empréstimos em aberto de um usuário específico
  // (Usado para validar a regra de limite de empréstimos)
  async findOpenLoansByUser(userId: string) {
    return await prisma.loan.findMany({
      where: {
        userId,
        returnDate: null, // Apenas os que ainda não foram devolvidos
      },
    });
  }
}