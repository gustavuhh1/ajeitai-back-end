import { IUserRepository } from "@/repositories/IUserRepository";

interface UpdateProviderPixRequest {
  providerId: string;
  pixKey: string;
}

export class UpdateProviderPixUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: UpdateProviderPixRequest): Promise<void> {
    const user = await this.userRepository.findById(request.providerId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (user.role !== "PROVIDER") {
      throw new Error("Apenas prestadores podem configurar uma chave PIX.");
    }

    user.pixKey = request.pixKey;

    await this.userRepository.update(user);
  }
}
