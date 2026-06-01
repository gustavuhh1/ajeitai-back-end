import { IUserRepository } from "@/repositories/IUserRepository";

export class ResetPasswordUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute(body: any): Promise<void> {
    await this.usersRepository.resetPassword(body);
  }
}
