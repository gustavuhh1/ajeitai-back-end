import { describe, it, expect, beforeEach } from 'vitest';
import { GetServiceDetailsUseCase } from '../../services/GetServiceDetailsUseCase';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { Service } from '../../../entities/Service';

describe('GetServiceDetailsUseCase', () => {
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let sut: GetServiceDetailsUseCase;

  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository();
    sut = new GetServiceDetailsUseCase(inMemoryServiceRepository);
  });

  it('deve ser possível obter os detalhes de um serviço', async () => {
    const service = new Service({
      id: 'service-123',
      title: 'Fix sink',
      description: 'The kitchen sink is leaking.',
      categoryIds: ['cat-1'],
      client_id: 'client-123',
      address_id: 'address-1',
      status: 'ABERTO'
    });

    inMemoryServiceRepository.items.push(service);

    const result = await sut.execute({ serviceId: 'service-123' });

    expect(result).toBeDefined();
    expect(result.id).toBe('service-123');
    expect(result.client).toBeDefined();
  });

  it('deve lançar erro se o serviço não for encontrado', async () => {
    await expect(() =>
      sut.execute({ serviceId: 'non-existent' })
    ).rejects.toThrow('Serviço não encontrado');
  });
});
