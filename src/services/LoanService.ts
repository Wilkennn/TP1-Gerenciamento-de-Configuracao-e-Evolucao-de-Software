import { LoanRepository } from "../repositories/LoanRepository";
import { BookRepository } from "../repositories/BookRepository";
import { UserRepository } from "../repositories/UserRepository";

export class LoanService {
  private loanRepository: LoanRepository;
  private bookRepository: BookRepository;
  private userRepository: UserRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
    this.bookRepository = new BookRepository();
    this.userRepository = new UserRepository();
  }

  async createLoan(userId: string, bookId: string) {
    // 1. Validar Usuário
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("Usuário não encontrado.");

    // 2. Validar Livro
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error("Livro não encontrado.");

    // 3. Validar Disponibilidade
    if (!book.available) {
      throw new Error("Livro indisponível. Alguém já o pegou emprestado.");
    }

    // 4. Regra de Negócio: Calcular data de devolução (7 dias)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // 5. Atualizar status do livro para indisponível
    await this.bookRepository.update(bookId, { available: false });

    // 6. Criar o empréstimo
    return await this.loanRepository.create(userId, bookId, dueDate);
  }

  async returnBook(loanId: string) {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) throw new Error("Empréstimo não encontrado.");

    if (loan.returnDate) {
      throw new Error("Este livro já foi devolvido anteriormente.");
    }

    const returnDate = new Date();

    // Verificação de atraso (simples log, poderia gerar cobrança)
    if (returnDate > loan.dueDate) {
      console.warn(`Devolução com atraso para o empréstimo ${loanId}`);
    }

    // 1. Registrar a devolução
    const updatedLoan = await this.loanRepository.updateReturnDate(loanId, returnDate);

    // 2. Liberar o livro para o próximo
    await this.bookRepository.update(loan.bookId, { available: true });

    return updatedLoan;
  }
}