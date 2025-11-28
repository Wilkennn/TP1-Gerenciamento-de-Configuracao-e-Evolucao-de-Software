import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o Seed do Banco de Dados...');

  // 1. Limpeza (Delete em ordem para respeitar Foreign Keys)
  // Apagamos primeiro os empréstimos, pois eles dependem de Users e Books
  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Banco de dados limpo.');

  // 2. Criar Usuários
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Silva',
      email: 'alice@puc.br',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Santos',
      email: 'bob@puc.br',
    },
  });

  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Junior',
      email: 'carlos@puc.br',
    },
  });

  console.log('👤 Usuários criados.');

  // 3. Criar Livros
  // Vamos criar referências para usar nos empréstimos abaixo
  const bookCleanCode = await prisma.book.create({
    data: {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      available: false, // Indisponível pois a Alice vai pegar
    },
  });

  const bookPatterns = await prisma.book.create({
    data: {
      title: 'Design Patterns',
      author: 'Gang of Four',
      isbn: '978-0201633610',
      available: true, // Disponível (foi devolvido)
    },
  });

  const bookDevOps = await prisma.book.create({
    data: {
      title: 'The DevOps Handbook',
      author: 'Gene Kim',
      isbn: '978-1942788003',
      available: false, // Indisponível (está atrasado com o Bob)
    },
  });

  const bookDomain = await prisma.book.create({
    data: {
      title: 'Domain-Driven Design',
      author: 'Eric Evans',
      isbn: '978-0321125217',
      available: true, // Disponível (ninguém pegou)
    },
  });

  console.log('📚 Livros criados.');

  // 4. Criar Empréstimos (Cenários de Teste)

  // CENÁRIO A: Empréstimo Ativo (Dentro do prazo)
  // Alice pegou o "Clean Code" hoje
  await prisma.loan.create({
    data: {
      userId: alice.id,
      bookId: bookCleanCode.id,
      loanDate: new Date(), // Hoje
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // +7 dias
      returnDate: null, // Ainda não devolveu
    },
  });

  // CENÁRIO B: Empréstimo Finalizado (Devolvido)
  // Bob pegou "Design Patterns" semana passada e já devolveu
  await prisma.loan.create({
    data: {
      userId: bob.id,
      bookId: bookPatterns.id,
      loanDate: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 dias atrás
      dueDate: new Date(new Date().setDate(new Date().getDate() - 3)),   // Vencia 3 dias atrás
      returnDate: new Date(new Date().setDate(new Date().getDate() - 3)), // Devolveu no prazo
    },
  });

  // CENÁRIO C: Empréstimo Atrasado (Overdue)
  // Bob pegou "DevOps Handbook" há 20 dias e sumiu com o livro
  await prisma.loan.create({
    data: {
      userId: bob.id,
      bookId: bookDevOps.id,
      loanDate: new Date(new Date().setDate(new Date().getDate() - 20)), // 20 dias atrás
      dueDate: new Date(new Date().setDate(new Date().getDate() - 13)),  // Venceu há 13 dias
      returnDate: null, // Não devolveu!
    },
  });

  console.log('j Empréstimos criados (Ativos, Devolvidos e Atrasados).');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });