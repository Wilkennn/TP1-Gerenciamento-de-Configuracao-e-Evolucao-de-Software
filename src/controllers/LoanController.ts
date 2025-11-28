import { Request, Response } from "express";
import { LoanService } from "../services/LoanService";
import { CreateLoanDTO } from "../dtos/LoanDTO";

export class LoanController {
  private loanService: LoanService;

  constructor() {
    this.loanService = new LoanService();
  }

  // POST /loans (Realizar Empréstimo)
  async create(req: Request, res: Response) {
    try {
      const { userId, bookId }: CreateLoanDTO = req.body;

      // Chama a regra de negócio complexa (valida disponibilidade, datas, etc)
      const loan = await this.loanService.createLoan(userId, bookId);

      return res.status(201).json({
        message: "Empréstimo realizado com sucesso!",
        loan,
      });
    } catch (error: any) {
      // Retorna 400 (Bad Request) se o livro estiver indisponível ou usuário inválido
      return res.status(400).json({ error: error.message });
    }
  }

  // POST /loans/:id/return (Devolução)
  async returnBook(req: Request, res: Response) {
    try {
      const { id } = req.params; // ID do empréstimo

      const updatedLoan = await this.loanService.returnBook(id);

      return res.status(200).json({
        message: "Livro devolvido com sucesso!",
        loan: updatedLoan,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  // GET /loans/overdue (Relatório de atrasados - Método Extra)
  // Ótimo para mostrar complexidade no TP
  async getOverdueLoans(req: Request, res: Response) {
      try {
          // Implementar no Service se quiser: return this.loanService.findOverdue();
          return res.status(501).json({ message: "Funcionalidade em desenvolvimento" });
      } catch (error) {
          return res.status(500).json({ error: "Erro interno" });
      }
  }
}