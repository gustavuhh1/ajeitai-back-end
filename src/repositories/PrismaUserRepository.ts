import {prisma} from '@/utils/prisma'
import {User} from "@/entities/User"
import {IUserRepository} from "@/usecases/CreateUserUseCase"
import { auth } from '@/auth/auth'

export class PrismaUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const userData = await prisma.user.findUnique({
            where: {email}
        })

        if(!userData) {
            return null
        }

        return new User({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            cpf: userData.cpf,
            role: userData.role as any,
            created_at: userData.createdAt
        })

    }

    async save(user: User): Promise<void> {
        await auth.api.signUpEmail({
            body: {
                name: user.name,
                email: user.email,
                password: user.password as any,
                cpf: user.cpf,
                role: user.role
            }
        })
    }
}