import { User } from '@/entities/User'

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    save(user: User): Promise<void>
    updateProfile(id: string, data: Partial<User>): Promise<void>
    changePassword(headers: Headers, body: any): Promise<void>
    forgetPassword(body: any): Promise<void>
    resetPassword(body: any): Promise<void>
}
