import { User } from '@/entities/User';
import { IUserRepository } from '../IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(u => u.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(u => u.id === id);
    return user || null;
  }

  async updateProfile(id: string, data: Partial<User>): Promise<void> {
    const userIndex = this.items.findIndex(u => u.id === id);
    if (userIndex >= 0) {
      const user = this.items[userIndex];
      this.items[userIndex] = new User({
        id: user.id,
        name: data.name ?? user.name,
        email: user.email,
        password: user.password,
        cpf: user.cpf,
        phone: data.phone ?? user.phone,
        birthDate: user.birthDate,
        description: data.description ?? user.description,
        image: data.image ?? user.image,
        role: user.role,
        avgRating: user.avgRating,
      });
    }
  }

  async save(user: User): Promise<void> {
    this.items.push(user);
  }

  // fora dos teste (login via Better-auth)
  async login(email: string, password: string): Promise<User | null> {
    const user = this.items.find(u => u.email === email && u.password === password);
    return user || null;
  }
}
