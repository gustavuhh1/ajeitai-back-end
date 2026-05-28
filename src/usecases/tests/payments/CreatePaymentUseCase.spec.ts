import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePaymentUseCase } from '../../payments/CreatePaymentUseCase';
import { InMemoryPaymentRepository } from '../../../repositories/in-memory/InMemoryPaymentRepository';

describe('CreatePaymentUseCase', () => {
  let inMemoryPaymentRepository: InMemoryPaymentRepository;
  let sut: CreatePaymentUseCase;

  beforeEach(() => {
    inMemoryPaymentRepository = new InMemoryPaymentRepository();
    sut = new CreatePaymentUseCase(inMemoryPaymentRepository);
  });

  it('deve ser possível processar um novo pagamento', async () => {
    const payment = await sut.execute({
      method: 'CREDIT_CARD',
      amount: 150,
      budgetId: 'budget-1',
      clientId: 'client-1'
    });

    expect(payment.id).toBeDefined();
    expect(payment.status).toBe('PENDENTE');
    expect(inMemoryPaymentRepository.items).toHaveLength(1);
  });

  it('deve ser possível processar um pagamento já com um ID de transação', async () => {
    const payment = await sut.execute({
      method: 'PIX',
      amount: 200,
      budgetId: 'budget-2',
      clientId: 'client-1',
      transactionId: 'txn-123'
    });

    expect(payment.status).toBe('PAGO');
    expect(payment.transaction_id).toBe('txn-123');
  });
});
