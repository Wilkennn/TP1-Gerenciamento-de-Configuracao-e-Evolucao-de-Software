import { UserService } from "../../src/services/UserService";

// 1. Criamos o Mock do Repositório
const mockUserRepo = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

// 2. Dizemos ao Jest para substituir a classe real pelo Mock
jest.mock("../../src/repositories/UserRepository", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => mockUserRepo),
  };
});

describe("UserService Unit Tests", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks(); // Limpa contadores dos mocks
  });

  it("deve criar um usuário com sucesso", async () => {
    // Arrange
    const userData = { name: "Teste Valido", email: "teste@puc.br" };
    mockUserRepo.findByEmail.mockResolvedValue(null); // E-mail não existe
    mockUserRepo.create.mockResolvedValue({ id: "1", ...userData });

    // Act
    const result = await userService.create(userData);

    // Assert
    expect(result).toHaveProperty("id");
    expect(mockUserRepo.create).toHaveBeenCalledWith(userData);
  });

  it("NÃO deve criar usuário com e-mail duplicado", async () => {
    // Arrange
    mockUserRepo.findByEmail.mockResolvedValue({ id: "existe", email: "teste@puc.br" });

    // Act & Assert
    await expect(userService.create({ name: "Teste", email: "teste@puc.br" }))
      .rejects
      .toThrow("Já existe um usuário cadastrado com este e-mail");
  });

  it("NÃO deve criar usuário com nome muito curto (< 3 chars)", async () => {
    // Arrange
    mockUserRepo.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(userService.create({ name: "Ab", email: "curto@puc.br" }))
      .rejects
      .toThrow("O nome deve ter no mínimo 3 caracteres");
  });
});