import { IUserRepository } from "@/repositories/IUserRepository";


export class ForgotPasswordUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute(body: any): Promise<void> {
    await this.usersRepository.forgetPassword(body);
  }
}
