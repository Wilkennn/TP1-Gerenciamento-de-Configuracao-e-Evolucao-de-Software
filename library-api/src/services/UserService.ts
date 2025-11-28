import { UserRepository } from "../repositories/UserRepository";
import { CreateUserDTO } from "../dtos/UserDTO";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data: CreateUserDTO) {
    // Regra: Não permitir dois usuários com o mesmo email
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error("Já existe um usuário cadastrado com este e-mail.");
    }

    // Regra: Nome deve ter no mínimo 3 caracteres (exemplo de validação simples)
    if (data.name.length < 3) {
      throw new Error("O nome deve ter no mínimo 3 caracteres.");
    }

    return await this.userRepository.create(data);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      // Opcional: Poderia lançar erro aqui ou deixar o controller tratar
      return null;
    }
    return user;
  }

  async findAll() {
    return await this.userRepository.findAll(); // Supondo que você criou este método no Repo
  }
}