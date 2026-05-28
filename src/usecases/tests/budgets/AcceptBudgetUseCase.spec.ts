import { describe, it, expect, beforeEach } from 'vitest';
import { AcceptBudgetUseCase } from '../../budgets/AcceptBudgetUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { Budget } from '../../../entities/Budget';

describe('AcceptBudgetUseCase', () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let sut: AcceptBudgetUseCase;

  beforeEach(() => {
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    sut = new AcceptBudgetUseCase(inMemoryBudgetRepository);
  });

  it('deve ser possível aceitar um orçamento e rejeitar os demais do mesmo serviço', async () => {
    inMemoryBudgetRepository.items.push(new Budget({
      id: 'budget-1',
      serviceId: 'service-1',
      providerId: 'provider-1',
      price: 150,
      description: 'Provider 1',
      estimatedDate: new Date(),
      status: 'AGUARDANDO_CLIENTE'
    }));

    inMemoryBudgetRepository.items.push(new Budget({
      id: 'budget-2',
      serviceId: 'service-1',
      providerId: 'provider-2',
      price: 200,
      description: 'Provider 2',
      estimatedDate: new Date(),
      status: 'AGUARDANDO_CLIENTE'
    }));

    const acceptedBudget = await sut.execute({
      budgetId: 'budget-1',
      serviceId: 'service-1'
    });

    expect(acceptedBudget.status).toBe('ACEITO');
    expect(inMemoryBudgetRepository.items[0]!.status).toBe('ACEITO');
    expect(inMemoryBudgetRepository.items[1]!.status).toBe('RECUSADO');
  });

  it('deve lançar erro se o orçamento não for encontrado', async () => {
    await expect(() =>
      sut.execute({
        budgetId: 'non-existent',
        serviceId: 'service-1'
      })
    ).rejects.toThrow('Orçamento não encontrado');
  });
});
