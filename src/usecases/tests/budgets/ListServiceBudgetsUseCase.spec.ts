import { describe, it, expect, beforeEach } from 'vitest';
import { ListServiceBudgetsUseCase } from '../../budgets/ListServiceBudgetsUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { InMemoryUserRepository } from '../../../repositories/in-memory/InMemoryUserRepository';
import { Budget } from '../../../entities/Budget';
import { User } from '../../../entities/User';

describe('ListServiceBudgetsUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let sut: ListServiceBudgetsUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository(inMemoryUserRepository);
    sut = new ListServiceBudgetsUseCase(inMemoryBudgetRepository);
  });

  it('deve ser possível listar orçamentos com detalhes do prestador para um serviço', async () => {
    inMemoryUserRepository.items.push(new User({
      id: 'provider-1',
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '12345678901',
      role: 'PROVIDER'
    }));

    inMemoryBudgetRepository.items.push(new Budget({
      id: 'budget-1',
      serviceId: 'service-1',
      providerId: 'provider-1',
      price: 150,
      description: 'I can fix it',
      estimatedDate: new Date(),
      status: 'AGUARDANDO_CLIENTE'
    }));

    const budgets = await sut.execute('service-1');

    expect(budgets).toHaveLength(1);
    expect(budgets[0]!.price).toBe(150);
    expect(budgets[0]!.provider.name).toBe('John Doe');
  });
});
