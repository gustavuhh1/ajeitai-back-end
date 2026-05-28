import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterProviderUseCase } from '../../users/RegisterProviderUseCase';
import { InMemoryUserRepository } from '../../../repositories/in-memory/InMemoryUserRepository';

describe('RegisterProviderUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: RegisterProviderUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new RegisterProviderUseCase(inMemoryUserRepository);
  });

  it('deve ser possível registrar um novo prestador', async () => {
    const user = await sut.execute({
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      cpf: '12345678901',
      password: 'password123',
      birthDate: new Date('1990-01-01'),
      description: 'I am a highly skilled professional with over 10 years of experience in the field of plumbing...',
    });

    expect(user.id).toBeDefined();
    expect(user.role).toBe('PROVIDER');
    expect(user.description).toBeDefined();
    expect(inMemoryUserRepository.items).toHaveLength(1);
  });

  it('não deve ser possível registrar um prestador com um email já existente', async () => {
    await sut.execute({
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      cpf: '12345678901',
      birthDate: new Date('1990-01-01'),
      description: 'I am a highly skilled professional...',
    });

    await expect(() =>
      sut.execute({
        name: 'John Smith',
        email: 'janesmith@example.com',
        cpf: '10987654321',
        birthDate: new Date('1985-05-05'),
        description: 'Another provider description...',
      })
    ).rejects.toThrow('Usuário já existe.');
  });
});
