import { BookService } from "../../src/services/BookService";

// 1. Mock do Repositório
const mockBookRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIsbn: jest.fn(),
  update: jest.fn(),
};

// 2. Substituição da classe real
jest.mock("../../src/repositories/BookRepository", () => {
  return {
    BookRepository: jest.fn().mockImplementation(() => mockBookRepo),
  };
});

describe("BookService Unit Tests", () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService();
    jest.clearAllMocks();
  });

  it("deve criar um livro novo com sucesso", async () => {
    const bookData = { title: "Livro Teste", author: "Dev", isbn: "123-456" };
    mockBookRepo.findByIsbn.mockResolvedValue(null); // ISBN livre
    mockBookRepo.create.mockResolvedValue({ id: "b1", ...bookData });

    const result = await bookService.create(bookData);

    expect(result).toHaveProperty("id", "b1");
  });

  it("NÃO deve permitir ISBN duplicado", async () => {
    mockBookRepo.findByIsbn.mockResolvedValue({ id: "existente" }); // ISBN já existe

    await expect(bookService.create({ title: "X", author: "Y", isbn: "123" }))
      .rejects
      .toThrow("Já existe um livro cadastrado com este ISBN");
  });

  it("deve retornar erro se o livro não for encontrado (findById)", async () => {
    mockBookRepo.findById.mockResolvedValue(null);

    await expect(bookService.findById("fake-id"))
      .rejects
      .toThrow("Livro não encontrado");
  });

  it("deve atualizar um livro existente", async () => {
    // Para atualizar, primeiro ele busca o livro. Precisamos mockar o findById retornando sucesso
    mockBookRepo.findById.mockResolvedValue({ id: "b1", title: "Antigo" });
    mockBookRepo.update.mockResolvedValue({ id: "b1", title: "Novo" });

    const result = await bookService.update("b1", { title: "Novo" });

    expect(result.title).toBe("Novo");
    expect(mockBookRepo.update).toHaveBeenCalled();
  });
  
  it("NÃO deve atualizar um livro que não existe", async () => {
     // O findById retorna null, simulando que o ID está errado
     mockBookRepo.findById.mockResolvedValue(null);
     
     await expect(bookService.update("fake-id", { title: "Novo" }))
        .rejects
        .toThrow("Livro não encontrado");
  });
});