import { describe, it, expect, beforeEach } from 'vitest';
import { CreateReviewUseCase } from '../../reviews/CreateReviewUseCase';
import { InMemoryReviewRepository } from '../../../repositories/in-memory/InMemoryReviewRepository';
import { InMemoryServiceRepository } from '../../../repositories/in-memory/InMemoryServiceRepository';
import { Service } from '../../../entities/Service';

describe('CreateReviewUseCase', () => {
  let inMemoryReviewRepository: InMemoryReviewRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let sut: CreateReviewUseCase;

  beforeEach(() => {
    inMemoryReviewRepository = new InMemoryReviewRepository();
    inMemoryServiceRepository = new InMemoryServiceRepository();
    sut = new CreateReviewUseCase(inMemoryReviewRepository, inMemoryServiceRepository);
  });

  it('deve ser possível criar uma avaliação para um serviço finalizado', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-1',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      city: 'City A',
      status: 'FINALIZADO'
    }));

    const review = await sut.execute({
      serviceId: 'service-1',
      rating: 5,
      comment: 'Excellent service!',
      reviewerId: 'client-1',
      reviewedId: 'provider-1'
    });

    expect(review.id).toBeDefined();
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Excellent service!');
    expect(inMemoryReviewRepository.items).toHaveLength(1);
  });

  it('não deve ser possível avaliar um serviço que não está finalizado', async () => {
    inMemoryServiceRepository.items.push(new Service({
      id: 'service-2',
      title: 'Plumbing',
      description: 'Fix pipes',
      categoryIds: ['cat-1'],
      client_id: 'client-1',
      city: 'City A',
      status: 'ABERTO'
    }));

    await expect(() =>
      sut.execute({
        serviceId: 'service-2',
        rating: 5,
        reviewerId: 'client-1',
        reviewedId: 'provider-1'
      })
    ).rejects.toThrow('Só é possível avaliar serviços finalizados');
  });

  it('não deve ser possível avaliar um serviço inexistente', async () => {
    await expect(() =>
      sut.execute({
        serviceId: 'non-existent',
        rating: 5,
        reviewerId: 'client-1',
        reviewedId: 'provider-1'
      })
    ).rejects.toThrow('Serviço não encontrado');
  });
});
