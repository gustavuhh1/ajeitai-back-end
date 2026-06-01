import { IUserRepository } from "@/repositories/IUserRepository";

export class ChangePasswordUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute(headers: Headers, body: any): Promise<void> {
    await this.usersRepository.changePassword(headers, body);
  }
}
