import { describe, it, expect, beforeEach } from 'vitest';
import { CounterProposalUseCase } from '../../budgets/CounterProposalUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { Budget } from '../../../entities/Budget';

describe('CounterProposalBudgetUseCase', () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let sut: CounterProposalUseCase;

  beforeEach(() => {
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    sut = new CounterProposalUseCase(inMemoryBudgetRepository);
  });

  it('deve ser possível fazer uma contraproposta', async () => {
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
        newPrice: 200,
        newDate: new Date(),
        newDescription: 'I can do it for 200 instead',
        isFromClient: true
      })
    ).rejects.toThrow('Orçamento não encontrado');
  });
});
