// src/dtos/UserDTO.ts

export interface CreateUserDTO {
  name: string;
  email: string;
}

// Opcional: Se futuramente quiser atualizar dados do usuário
export interface UpdateUserDTO {
  name?: string;
  email?: string;
}