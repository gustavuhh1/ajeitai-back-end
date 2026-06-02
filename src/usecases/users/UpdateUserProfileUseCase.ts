import { IUserRepository } from "@/repositories/IUserRepository";

interface UpdateUserProfileRequest {
  userId: string;
  name?: string;
  phone?: string;
  description?: string;
  image?: string;
}

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ userId, name, phone, description, image }: UpdateUserProfileRequest): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    await this.userRepository.updateProfile(userId, {
      name,
      phone,
      description,
      image,
    });
  }
}
