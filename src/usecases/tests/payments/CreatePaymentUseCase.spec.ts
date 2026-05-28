import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreatePaymentUseCase } from '../../payments/CreatePaymentUseCase';
import { InMemoryPaymentRepository } from '../../../repositories/in-memory/InMemoryPaymentRepository';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/InMemoryBudgetRepository';
import { Budget } from '../../../entities/Budget';

// Mock do SDK do AbacatePay
vi.mock('@/lib/abacatePay', () => ({
  abacatePay: {
    billing: {
      create: vi.fn().mockResolvedValue({
        data: {
          id: 'mock-transaction-id',
          url: 'https://checkout.abacatepay.com/mock-url'
        }
      })
    }
  }
}));

describe('CreatePaymentUseCase', () => {
  let inMemoryPaymentRepository: InMemoryPaymentRepository;
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let sut: CreatePaymentUseCase;

  beforeEach(() => {
    inMemoryPaymentRepository = new InMemoryPaymentRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    sut = new CreatePaymentUseCase(inMemoryPaymentRepository, inMemoryBudgetRepository);
  });

  it('deve ser possível gerar a fatura no abacatepay e salvar o pagamento', async () => {
    const budget = new Budget({
      id: 'budget-1',
      price: 150.00,
      description: 'Orçamento de teste',
      estimatedDate: new Date(),
      status: 'AGUARDANDO_CLIENTE',
      serviceId: 'service-1',
      providerId: 'provider-1'
    });
    
    inMemoryBudgetRepository.items.push(budget);

    const payment = await sut.execute({
      budgetId: 'budget-1',
      clientId: 'client-1'
    });

    expect(payment.id).toBeDefined();
    expect(payment.status).toBe('PENDENTE');
    expect(payment.transaction_id).toBe('mock-transaction-id');
    expect(payment.checkoutUrl).toBe('https://checkout.abacatepay.com/mock-url');
    // Verifica se somou a taxa de 0.80 ao valor
    expect(payment.amount).toBe(150.80);
    expect(inMemoryPaymentRepository.items).toHaveLength(1);
  });

  it('não deve ser possível processar pagamento de um orçamento que não foi aprovado ou aguardando cliente', async () => {
    const budget = new Budget({
      id: 'budget-2',
      price: 200.00,
      description: 'Orçamento de teste recusado',
      estimatedDate: new Date(),
      status: 'RECUSADO',
      serviceId: 'service-2',
      providerId: 'provider-1'
    });
    
    inMemoryBudgetRepository.items.push(budget);

    await expect(sut.execute({
      budgetId: 'budget-2',
      clientId: 'client-1',
    })).rejects.toThrow("Orçamento inválido para pagamento.");
  });
});
