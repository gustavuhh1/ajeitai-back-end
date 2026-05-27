import { User } from "@/entities/User"
import { IUserRepository } from "@/repositories/IUserRepository"

interface RegisterClientRequest {
    name: string
    email: string
    password?: string
    cpf: string
}

export class RegisterClientUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: RegisterClientRequest) {
        const userAlreadyExists = await this.userRepository.findByEmail(data.email)

        if(userAlreadyExists) {
            throw new Error("Usuário já existe.")
        }

        const user = new User({
            name: data.name,
            email: data.email,
            password: data.password,
            cpf: data.cpf,
            role: "CLIENT"
        })

        await this.userRepository.save(user)
        return user
    }
}
