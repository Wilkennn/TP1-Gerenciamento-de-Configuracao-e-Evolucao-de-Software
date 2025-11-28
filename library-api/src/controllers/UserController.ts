import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { CreateUserDTO } from "../dtos/UserDTO";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // POST /users
  async create(req: Request, res: Response) {
    try {
      const data: CreateUserDTO = req.body;
      const user = await this.userService.create(data);
      return res.status(201).json(user);
    } catch (error: any) {
      // Erro comum: Email duplicado (tratado no Service/Repository)
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /users/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      if (!user) {
         return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  // GET /users (Opcional, mas ajuda na contagem de métodos)
  async getAll(req: Request, res: Response) {
      try {
          const users = await this.userService.findAll();
          return res.status(200).json(users);
      } catch (error: any) {
          return res.status(500).json({ error: error.message });
      }
  }
}