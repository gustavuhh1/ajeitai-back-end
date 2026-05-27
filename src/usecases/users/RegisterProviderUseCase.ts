import { User } from "@/entities/User"
import { IUserRepository } from "@/repositories/IUserRepository"

interface RegisterProviderRequest {
    name: string
    email: string
    password?: string
    cpf: string
    avatar_url?: string
    phone: string
    age: number
    description: string
}

export class RegisterProviderUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: RegisterProviderRequest) {
        const userAlreadyExists = await this.userRepository.findByEmail(data.email)

        if(userAlreadyExists) {
            throw new Error("Usuário já existe.")
        }

        const user = new User({
            name: data.name,
            email: data.email,
            password: data.password,
            cpf: data.cpf,
            avatar_url: data.avatar_url,
            phone: data.phone,
            age: data.age,
            description: data.description,
            role: "PROVIDER"
        })

        await this.userRepository.save(user)
        return user
    }
}
