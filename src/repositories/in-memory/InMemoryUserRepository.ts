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

  async save(user: User): Promise<void> {
    this.items.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.items[index] = user;
    }
  }

  // fora dos teste (login via Better-auth)
  async login(email: string, password: string): Promise<User | null> {
    const user = this.items.find(u => u.email === email && u.password === password);
    return user || null;
  }
}
