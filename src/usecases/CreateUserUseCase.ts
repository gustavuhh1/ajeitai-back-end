import bcrypt from 'bcryptjs'
import {User, UserProps} from '@/entities/User'

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>
    save(user: User): Promise<void>
}

export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: UserProps) {
        const userAlreadyExists = await this.userRepository.findByEmail(data.email)

        if(userAlreadyExists) {
            throw new Error("User already exists.")
        }

        const hashedPassword = await bcrypt.hash(data.password, 8)

        const user = new User({
            ...data,
            password: hashedPassword
        })

        await this.userRepository.save(user)
        return user
    }
}