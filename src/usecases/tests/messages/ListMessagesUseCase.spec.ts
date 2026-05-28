import { describe, it, expect, beforeEach } from 'vitest';
import { ListMessagesUseCase } from '../../messages/ListMessagesUseCase';
import { InMemoryMessageRepository } from '../../../repositories/in-memory/InMemoryMessageRepository';
import { Message } from '../../../entities/Message';

describe('ListMessagesUseCase', () => {
  let inMemoryMessageRepository: InMemoryMessageRepository;
  let sut: ListMessagesUseCase;

  beforeEach(() => {
    inMemoryMessageRepository = new InMemoryMessageRepository();
    sut = new ListMessagesUseCase(inMemoryMessageRepository);
  });

  it('deve ser possível listar todas as mensagens do chat de um orçamento', async () => {
    inMemoryMessageRepository.items.push(new Message({
      budgetId: 'budget-1',
      senderId: 'client-1',
      text: 'Hello'
    }));

    inMemoryMessageRepository.items.push(new Message({
      budgetId: 'budget-1',
      senderId: 'provider-1',
      text: 'Hi there'
    }));

    inMemoryMessageRepository.items.push(new Message({
      budgetId: 'budget-2',
      senderId: 'client-2',
      text: 'Wrong chat'
    }));

    const messages = await sut.execute('budget-1');

    expect(messages).toHaveLength(2);
    expect(messages[0]!.text).toBe('Hello');
    expect(messages[1]!.text).toBe('Hi there');
  });
});
