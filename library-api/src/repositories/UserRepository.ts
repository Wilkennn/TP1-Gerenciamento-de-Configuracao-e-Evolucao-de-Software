import { prisma } from "../database/prisma";
import { CreateUserDTO } from "../dtos/UserDTO";

export class UserRepository {
  // Cria um usuário
  async create(data: CreateUserDTO) {
    return await prisma.user.create({
      data,
    });
  }

  // Busca usuário por ID
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Busca por Email (usado para validar duplicidade no Service)
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Lista todos (útil para o controller)
  async findAll() {
    return await prisma.user.findMany();
  }
}