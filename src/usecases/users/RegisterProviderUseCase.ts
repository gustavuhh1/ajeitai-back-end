import { User } from "@/entities/User"
import { IUserRepository } from "@/repositories/IUserRepository"

interface RegisterProviderRequest {
    name: string
    email: string
    password?: string
    cpf: string
    image?: string
    phone?: string
    birthDate: Date
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
            image: data.image,
            phone: data.phone,
            birthDate: data.birthDate,
            description: data.description,
            role: "PROVIDER"
        })

        await this.userRepository.save(user)
        return user
    }
}

