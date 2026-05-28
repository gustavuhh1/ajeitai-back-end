import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterClientUseCase } from '../../users/RegisterClientUseCase';
import { InMemoryUserRepository } from '../../../repositories/in-memory/InMemoryUserRepository';

describe('RegisterClientUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: RegisterClientUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new RegisterClientUseCase(inMemoryUserRepository);
  });

  it('deve ser possível registrar um novo cliente', async () => {
    const user = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678901',
      password: 'password123',
    });

    expect(user.id).toBeDefined();
    expect(user.role).toBe('CLIENT');
    expect(inMemoryUserRepository.items).toHaveLength(1);
  });

  it('não deve ser possível registrar um cliente com um email já existente', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678901',
      password: 'password123',
    });

    await expect(() =>
      sut.execute({
        name: 'Jane Doe',
        email: 'johndoe@example.com',
        cpf: '10987654321',
      })
    ).rejects.toThrow('Usuário já existe.');
  });
});
