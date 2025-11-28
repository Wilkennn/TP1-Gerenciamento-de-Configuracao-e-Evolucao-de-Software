import { LoanService } from "../../src/services/LoanService";

// Mocks das classes de repositório
// Isso impede que o teste tente conectar no MySQL real
const mockLoanRepo = {
  create: jest.fn(),
  findOpenLoansByUser: jest.fn(),
  findById: jest.fn(),
  updateReturnDate: jest.fn(),
};

const mockBookRepo = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockUserRepo = {
  findById: jest.fn(),
};

// Intercepta as importações reais e entrega os mocks
jest.mock("../../src/repositories/LoanRepository", () => {
  return { LoanRepository: jest.fn().mockImplementation(() => mockLoanRepo) };
});
jest.mock("../../src/repositories/BookRepository", () => {
  return { BookRepository: jest.fn().mockImplementation(() => mockBookRepo) };
});
jest.mock("../../src/repositories/UserRepository", () => {
  return { UserRepository: jest.fn().mockImplementation(() => mockUserRepo) };
});

describe("LoanService Unit Tests", () => {
  let loanService: LoanService;

  beforeEach(() => {
    loanService = new LoanService();
  });

  it("deve realizar um empréstimo com sucesso", async () => {
    // Arrange (Preparar)
    mockUserRepo.findById.mockResolvedValue({ id: "user-1", name: "Teste" });
    mockBookRepo.findById.mockResolvedValue({ id: "book-1", available: true });
    mockLoanRepo.findOpenLoansByUser.mockResolvedValue([]); // 0 empréstimos ativos
    mockLoanRepo.create.mockResolvedValue({ id: "loan-1" });

    // Act (Executar)
    const result = await loanService.createLoan("user-1", "book-1");

    // Assert (Verificar)
    expect(result).toHaveProperty("id", "loan-1");
    expect(mockBookRepo.update).toHaveBeenCalledWith("book-1", { available: false });
  });

  it("NÃO deve emprestar um livro indisponível", async () => {
    // Arrange
    mockUserRepo.findById.mockResolvedValue({ id: "user-1" });
    mockBookRepo.findById.mockResolvedValue({ id: "book-1", available: false }); // <--- Indisponível

    // Act & Assert
    await expect(loanService.createLoan("user-1", "book-1"))
      .rejects
      .toThrow("Livro indisponível");
  });

  it("NÃO deve emprestar se o usuário não existir", async () => {
    // Arrange
    mockUserRepo.findById.mockResolvedValue(null); // Usuário não existe

    // Act & Assert
    await expect(loanService.createLoan("fake-user", "book-1"))
      .rejects
      .toThrow("Usuário não encontrado");
  });
});