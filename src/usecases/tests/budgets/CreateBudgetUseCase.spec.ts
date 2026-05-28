import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBudgetUseCase } from '../../budgets/CreateBudgetUseCase';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { Service } from '../../../entities/Service';

describe('CreateBudgetUseCase', () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let sut: CreateBudgetUseCase;

  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    sut = new CreateBudgetUseCase(inMemoryBudgetRepository, inMemoryServiceRepository);
  });

  it('deve ser possível criar um novo orçamento para um serviço aberto', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      city: 'City A',
      status: 'ABERTO'
    }));

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

  it('não deve ser possível criar um orçamento para um serviço inexistente', async () => {
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

  it('não deve ser possível criar um orçamento para um serviço que não está aberto', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-2',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      city: 'City A',
      status: 'APROVADO'
    }));

    await expect(() =>
      sut.execute({
        serviceId: 'service-2',
        providerId: 'provider-1',
        price: 150,
        description: 'I can fix it tomorrow',
        estimatedDate: new Date()
      })
    ).rejects.toThrow('Não é possível enviar orçamento para um serviço que não está aberto');
  });
});
