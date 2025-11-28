// src/dtos/LoanDTO.ts

export interface CreateLoanDTO {
  userId: string; // UUID do usuário
  bookId: string; // UUID do livro
}

export interface ReturnLoanDTO {
  loanId: string;
}