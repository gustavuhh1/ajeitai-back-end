import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryBookingRepository } from '@/repositories/in-memory/in-memory-booking-repository';
import { InMemoryPaymentRepository } from '@/repositories/in-memory/in-memory-payment-repository';
import { CreatePaymentUseCase } from './CreatePaymentUseCase';
import { BookingStatus } from '@prisma/client';

let bookingRepository: InMemoryBookingRepository;
let paymentRepository: InMemoryPaymentRepository;
let sut: CreatePaymentUseCase;

describe('Create Payment Use Case', () => {
    beforeEach(() => {
        bookingRepository = new InMemoryBookingRepository();
        paymentRepository = new InMemoryPaymentRepository();
        sut = new CreatePaymentUseCase(bookingRepository, paymentRepository);
    });

    it('deve ser capaz de registar um pagamento para um serviço concluído', async () => {
        const bookingId = 'booking-01';
        const clientId = 'client-01';

        bookingRepository.items.push({
            id: bookingId,
            client_id: clientId,
            status: BookingStatus.COMPLETED,
            payment: null
        });

        const payment = await sut.execute({
            bookingId,
            clientId,
            amount: 150,
            method: 'PIX'
        });

        expect(payment.id).toBeDefined();
        expect(payment.status).toBe('PAID');
    });

    it('não deve permitir pagamento se o serviço não estiver COMPLETED', async () => {
        bookingRepository.items.push({
            id: 'booking-01',
            client_id: 'client-01',
            status: BookingStatus.SCHEDULED,
            payment: null
        });

        await expect(() => 
            sut.execute({ bookingId: 'booking-01', clientId: 'client-01', amount: 100, method: 'PIX' })
        ).rejects.toThrow('Booking not completed');
    });

    it('não deve permitir duplicidade de pagamento', async () => {
        bookingRepository.items.push({
            id: 'booking-01',
            client_id: 'client-01',
            status: BookingStatus.COMPLETED,
            payment: { id: 'pagamento-ja-existente' }
        });

        await expect(() => 
            sut.execute({ bookingId: 'booking-01', clientId: 'client-01', amount: 100, method: 'PIX' })
        ).rejects.toThrow('Payment already exists');
    });
});