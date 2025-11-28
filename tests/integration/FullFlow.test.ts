import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/database/prisma";

describe("Integration - Full System Flow", () => {
  let userId: string;
  let bookId: string;
  let loanId: string;

  // ANTES DE TUDO: Prepara o terreno (Setup)
  beforeAll(async () => {
    await prisma.$connect();
    
    // Cria um usuário para ser usado nos testes
    const user = await prisma.user.create({
        data: { name: "Test User", email: `test-${Date.now()}@puc.br` }
    });
    userId = user.id;

    // Cria um livro para ser usado nos testes
    const book = await prisma.book.create({
        data: { title: "Test Book", author: "Tester", isbn: `ISBN-${Date.now()}` }
    });
    bookId = book.id;
  });

  // DEPOIS DE TUDO: Limpa a sujeira (Teardown)
  afterAll(async () => {
    // Apaga na ordem correta para não dar erro de chave estrangeira
    if (loanId) await prisma.loan.delete({ where: { id: loanId } }).catch(() => {});
    await prisma.book.delete({ where: { id: bookId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  // Teste 1: O endpoint de criar usuário funciona? (Teste isolado)
  it("POST /users - deve criar um usuário via API", async () => {
    const response = await request(app).post("/users").send({
      name: "Outro User",
      email: `outro-${Date.now()}@test.com`,
    });
    expect(response.status).toBe(201);
    
    // Limpeza específica deste teste (para não sujar o banco)
    await prisma.user.delete({ where: { id: response.body.id } });
  });

  // Teste 2: O fluxo de empréstimo funciona com os dados do beforeAll?
  it("POST /loans - deve realizar um empréstimo", async () => {
    const response = await request(app).post("/loans").send({
      userId: userId, // Usa o ID criado no beforeAll
      bookId: bookId, // Usa o ID criado no beforeAll
    });

    expect(response.status).toBe(201);
    loanId = response.body.loan.id; // Guardamos esse ID só para limpar depois
  });

  // Teste 3: Devolução
  it("POST /loans/:id/return - deve devolver o livro", async () => {
    // Precisamos garantir que existe um empréstimo para devolver.
    // Se o teste anterior falhar, este aqui quebraria na versão anterior.
    // A forma correta é criar um empréstimo AGORA ou garantir a ordem.
    
    // Se quisermos testar a devolução isoladamente, criaríamos o empréstimo aqui dentro:
    const tempLoan = await prisma.loan.create({
        data: { 
            userId, bookId, dueDate: new Date() 
        }
    });

    const response = await request(app).post(`/loans/${tempLoan.id}/return`);
    expect(response.status).toBe(200);
    
    // Cleanup local
    await prisma.loan.delete({ where: { id: tempLoan.id } });
  });
});