import { describe, it, expect, beforeEach } from 'vitest';
import { AcceptBudgetUseCase } from '../../budgets/AcceptBudgetUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { Budget } from '../../../entities/Budget';
import { Service } from '../../../entities/Service';

describe('AcceptBudgetUseCase', () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let notificationServiceMock: any;
  let sut: AcceptBudgetUseCase;

  beforeEach(() => {
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    inMemoryServiceRepository = new InMemoryServiceRepository();
    notificationServiceMock = { dispatch: async () => {} };
    sut = new AcceptBudgetUseCase(
      inMemoryBudgetRepository, 
      inMemoryServiceRepository,
      notificationServiceMock
    );
  });

  it('deve ser possível aceitar um orçamento e rejeitar os demais do mesmo serviço', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      client_id: 'client-1',
      title: 'Service 1',
      description: 'Desc',
      address_id: 'addr-1',
      categoryIds: ['cat-1']
    }));

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
      userId: 'client-1',
      isFromClient: true
    });

    expect(acceptedBudget.status).toBe('ACEITO');
    expect(inMemoryBudgetRepository.items[0]!.status).toBe('ACEITO');
    expect(inMemoryBudgetRepository.items[1]!.status).toBe('RECUSADO');
  });

  it('deve lançar erro se o orçamento não for encontrado', async () => {
    await expect(() =>
      sut.execute({
        budgetId: 'non-existent',
        userId: 'client-1',
        isFromClient: true
      })
    ).rejects.toThrow('Orçamento não encontrado');
  });
});
