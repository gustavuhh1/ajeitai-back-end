import { describe, it, expect, beforeEach } from 'vitest';
import { CreateServiceUseCase } from '../../services/CreateServiceUseCase';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { InMemoryCategoryRepository } from '../../../repositories/in-memory/InMemoryCategoryRepository';

describe('CreateServiceUseCase', () => {
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let sut: CreateServiceUseCase;

  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository();
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    sut = new CreateServiceUseCase(inMemoryServiceRepository, inMemoryCategoryRepository);
  });

  it('deve ser possível criar um novo serviço', async () => {
    inMemoryCategoryRepository.items.push({ id: 'cat-1', name: 'Plumbing' });

    const service = await sut.execute({
      title: 'Fix sink',
      description: 'The kitchen sink is leaking.',
      categoryIds: ['cat-1'],
      client_id: 'client-123',
      city: 'New York',
    });

    expect(service.id).toBeDefined();
    expect(service.status).toBe('ABERTO');
    expect(inMemoryServiceRepository.items).toHaveLength(1);
    expect(inMemoryServiceRepository.items[0]!.client_id).toBe('client-123');
  });

  it('não deve ser possível criar um serviço com categorias inexistentes', async () => {
    await expect(() =>
      sut.execute({
        title: 'Fix sink',
        description: 'The kitchen sink is leaking.',
        categoryIds: ['non-existent-cat'],
        client_id: 'client-123',
        city: 'New York',
      })
    ).rejects.toThrow('Uma ou mais categorias informadas não foram encontradas');
  });
});
