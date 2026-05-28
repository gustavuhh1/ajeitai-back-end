import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBudgetUseCase } from '../../budgets/CreateBudgetUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { InMemoryUserRepository } from '../../../repositories/in-memory/InMemoryUserRepository';
import { Service } from '../../../entities/Service';
import { User } from '../../../entities/User';

describe('CreateBudgetUseCase', () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: CreateBudgetUseCase;

  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreateBudgetUseCase(inMemoryBudgetRepository, inMemoryServiceRepository, inMemoryUserRepository);
  });

  it('deve ser possível criar um novo orçamento para um serviço aberto se prestador tiver chave PIX', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      city: 'City A',
      status: 'ABERTO'
    }));

    const provider = new User({
      id: 'provider-1',
      name: 'Joao',
      email: 'joao@email.com',
      cpf: '123',
      role: 'PROVIDER',
      pixKey: 'minhachavepix'
    });
    await inMemoryUserRepository.save(provider);

    const budget = await sut.execute({
      serviceId: 'service-1',
      providerId: 'provider-1',
      price: 150,
      description: 'I can fix it tomorrow',
      estimatedDate: new Date()
    });

    expect(budget.id).toBeDefined();
    expect(budget.status).toBe('AGUARDANDO_CLIENTE');
    expect(inMemoryBudgetRepository.items).toHaveLength(1);
  });

  it('não deve ser possível criar um orçamento se prestador não tiver chave PIX', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      city: 'City A',
      status: 'ABERTO'
    }));

    const provider = new User({
      id: 'provider-2',
      name: 'Maria',
      email: 'maria@email.com',
      cpf: '321',
      role: 'PROVIDER',
    });
    await inMemoryUserRepository.save(provider);

    await expect(() =>
      sut.execute({
        serviceId: 'service-1',
        providerId: 'provider-2',
        price: 150,
        description: 'I can fix it tomorrow',
        estimatedDate: new Date()
      })
    ).rejects.toThrow('Você precisa configurar sua chave PIX no perfil antes de enviar orçamentos.');
  });

  it('não deve ser possível criar um orçamento para um serviço inexistente', async () => {
    const provider = new User({
      id: 'provider-1',
      name: 'Joao',
      email: 'joao@email.com',
      cpf: '123',
      role: 'PROVIDER',
      pixKey: 'minhachavepix'
    });
    await inMemoryUserRepository.save(provider);

    await expect(() =>
      sut.execute({
        serviceId: 'non-existent-service',
        providerId: 'provider-1',
        price: 150,
        description: 'I can fix it tomorrow',
        estimatedDate: new Date()
      })
    ).rejects.toThrow('Serviço não encontrado');
  });
});
