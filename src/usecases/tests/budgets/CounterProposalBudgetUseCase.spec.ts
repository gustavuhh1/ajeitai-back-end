import { describe, it, expect, beforeEach } from 'vitest';
import { CounterProposalUseCase } from '../../budgets/CounterProposalUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { Budget } from '../../../entities/Budget';
import { Service } from '../../../entities/Service';

describe('CounterProposalBudgetUseCase', () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let sut: CounterProposalUseCase;

  beforeEach(() => {
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    inMemoryServiceRepository = new InMemoryServiceRepository();
    sut = new CounterProposalUseCase(inMemoryBudgetRepository, inMemoryServiceRepository);
  });

  it('deve ser possível fazer uma contraproposta', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      client_id: 'client-1',
      title: 'Service 1',
      description: 'Desc',
      address_id: 'addr-1',
      categoryIds: ['cat-1']
    }));

    const budget = new Budget({
      id: 'budget-1',
      serviceId: 'service-1',
      providerId: 'provider-1',
      price: 150,
      description: 'I can fix it tomorrow',
      estimatedDate: new Date(),
      status: 'AGUARDANDO_CLIENTE'
    });

    inMemoryBudgetRepository.items.push(budget);

    const newDate = new Date();
    const updatedBudget = await sut.execute({
      budgetId: 'budget-1',
      userId: 'client-1',
      newPrice: 200,
      newDate: newDate,
      newDescription: 'I can do it for 200 instead',
      isFromClient: true
    });

    expect(updatedBudget.price).toBe(200);
    expect(updatedBudget.description).toBe('I can do it for 200 instead');
  });

  it('deve lançar um erro se o orçamento não for encontrado', async () => {
    await expect(() =>
      sut.execute({
        budgetId: 'non-existent-budget',
        userId: 'client-1',
        newPrice: 200,
        newDate: new Date(),
        newDescription: 'I can do it for 200 instead',
        isFromClient: true
      })
    ).rejects.toThrow('Orçamento não encontrado');
  });
});
