// import { describe, it, expect, beforeEach } from 'vitest';
// import { CreateReviewUseCase } from './CreateReviewUseCase';
// import { InMemoryReviewRepository } from '@/repositories/in-memory/in-memory-review-repository';
// import { InMemoryBookingRepository } from '@/repositories/in-memory/in-memory-booking-repository';
// import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
// import { BookingStatus, Role } from '@prisma/client';

// let userRepository: InMemoryUserRepository;
// let bookingRepository: InMemoryBookingRepository;
// let reviewRepository: InMemoryReviewRepository;
// let sut: CreateReviewUseCase;

// describe('Create Review Use Case', () => {
//   beforeEach(() => {
//     userRepository = new InMemoryUserRepository();
//     bookingRepository = new InMemoryBookingRepository();
//     // Passamos o userRepository para o reviewRepository simular a transação
//     reviewRepository = new InMemoryReviewRepository(userRepository);
//     sut = new CreateReviewUseCase(reviewRepository, bookingRepository);
//   });

//   it('deve ser capaz de avaliar um prestador e atualizar a média dele', async () => {
//     // 1. Criar o prestador
//     userRepository.items.push({ id: 'provider-1', role: Role.PROVIDER, avgRating: 0 });

//     // 2. Criar o agendamento concluído
//     bookingRepository.items.push({
//       id: 'booking-1',
//       client_id: 'client-1',
//       provider_id: 'provider-1',
//       status: BookingStatus.COMPLETED,
//     });

//     const review = await sut.execute({
//       bookingId: 'booking-1',
//       reviewerId: 'client-1',
//       rating: 5,
//       comment: 'Serviço excelente!',
//     });

//     expect(review.id).toBeDefined();
//     expect(userRepository.items[0].avgRating.toNumber()).toBe(5);
//   });

//   it('não deve permitir avaliar um agendamento que não existe', async () => {
//     await expect(() =>
//       sut.execute({ bookingId: 'non-existing', reviewerId: 'client-1', rating: 5 })
//     ).rejects.toThrow('Booking not found');
//   });

//   it('não deve permitir que um cliente avalie o agendamento de outro cliente', async () => {
//     bookingRepository.items.push({
//       id: 'booking-1',
//       client_id: 'outro-cliente',
//       status: BookingStatus.COMPLETED,
//     });

//     await expect(() =>
//       sut.execute({ bookingId: 'booking-1', reviewerId: 'cliente-real', rating: 5 })
//     ).rejects.toThrow('Forbidden');
//   });

//   it('não deve permitir avaliar um serviço que não está concluído', async () => {
//     bookingRepository.items.push({
//       id: 'booking-1',
//       client_id: 'client-1',
//       status: BookingStatus.SCHEDULED,
//     });

//     await expect(() =>
//       sut.execute({ bookingId: 'booking-1', reviewerId: 'client-1', rating: 5 })
//     ).rejects.toThrow('Booking not completed');
//   });

//   it('não deve permitir duplicidade de avaliação para o mesmo agendamento', async () => {
//     bookingRepository.items.push({
//       id: 'booking-1',
//       client_id: 'client-1',
//       provider_id: 'provider-1',
//       status: BookingStatus.COMPLETED,
//     });

//     // Primeira avaliação
//     await sut.execute({ bookingId: 'booking-1', reviewerId: 'client-1', rating: 4 });

//     // Segunda tentativa
//     await expect(() =>
//       sut.execute({ bookingId: 'booking-1', reviewerId: 'client-1', rating: 5 })
//     ).rejects.toThrow('Review already exists');
//   });
// });