import { describe, it, expect, beforeEach } from 'vitest';
import { SendMessageUseCase } from '../../messages/SendMessageUseCase';
import { InMemoryMessageRepository } from '../../../repositories/in-memory/InMemoryMessageRepository';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { Budget } from '../../../entities/Budget';
import { Service } from '../../../entities/Service';

describe('SendMessageUseCase', () => {
  let inMemoryMessageRepository: InMemoryMessageRepository;
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let notificationServiceMock: any;
  let sut: SendMessageUseCase;

  beforeEach(() => {
    inMemoryMessageRepository = new InMemoryMessageRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    inMemoryServiceRepository = new InMemoryServiceRepository();
    notificationServiceMock = { dispatch: async () => {} };
    
    sut = new SendMessageUseCase(
      inMemoryMessageRepository, 
      inMemoryBudgetRepository,
      inMemoryServiceRepository,
      notificationServiceMock
    );
  });

  it('deve ser possível enviar uma mensagem de texto no chat do orçamento', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      address_id: 'address-1',
      status: 'ABERTO'
    }));

    inMemoryBudgetRepository.items.push(new Budget({
      id: 'budget-1',
      serviceId: 'service-1',
      providerId: 'provider-1',
      price: 100,
      description: 'Desc',
      estimatedDate: new Date(),
      status: 'AGUARDANDO_PRESTADOR'
    }));

    const message = await sut.execute({
      text: 'Hello!',
      senderId: 'client-1',
      budgetId: 'budget-1'
    });

    expect(message.id).toBeDefined();
    expect(message.text).toBe('Hello!');
    expect(inMemoryMessageRepository.items).toHaveLength(1);
  });

  it('não deve ser possível enviar uma mensagem sem texto ou imagem', async () => {
    await expect(() =>
      sut.execute({
        senderId: 'client-1',
        budgetId: 'budget-1'
      })
    ).rejects.toThrow('A mensagem deve conter texto ou imagem');
  });

  it('não deve ser possível enviar uma mensagem para um orçamento inexistente', async () => {
    await expect(() =>
      sut.execute({
        text: 'Hello!',
        senderId: 'client-1',
        budgetId: 'non-existent'
      })
    ).rejects.toThrow('Orçamento não encontrado');
  });
});
