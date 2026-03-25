import {IUserRepository} from '@/usecases/CreateUserUseCase'
import {User} from '@/entities/User'

export class InMemoryUserRepository implements IUserRepository {
    public items: User[] = []

    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find(item => item.email === email)

        return user || null 
    }

    async save(user: User): Promise<void> {
        this.items.push(user)
    }
}