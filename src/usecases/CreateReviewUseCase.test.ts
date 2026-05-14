import {describe, it, expect, beforeEach} from 'vitest'
import { CreateReviewUseCase } from './CreateReviewUseCase'
import { InMemoryReviewRepository } from '@/repositories/in-memory/in-memory-review-repository'
import { InMemoryBookingRepository } from '@/repositories/in-memory/in-memory-booking-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { User } from '@/entities/User'
import { BookingStatus, Prisma} from '@prisma/client'

let userRepository: InMemoryUserRepository
let bookingRepository: InMemoryBookingRepository
let reviewRepository: InMemoryReviewRepository
let sut: CreateReviewUseCase

describe('Create review Use Case', ()=> {
    beforeEach(()=> {
        userRepository = new InMemoryUserRepository()
        bookingRepository = new InMemoryBookingRepository()
        reviewRepository = new InMemoryReviewRepository(userRepository)
        sut = new CreateReviewUseCase(reviewRepository, bookingRepository)
    })

    it('deve ser capaz de avaliar um prestador e atualizar a média dele', async () => {
        const providerId = 'provider-01'
        const clientId = 'client-01'

        const provider = new User({
            id: providerId,
            name: 'João Prestador',
            email: 'joao@examplo.com',
            cpf: '12345678901',
            role: 'PROVIDER',
            avgRating: new Prisma.Decimal(0)
        })

        await userRepository.save(provider)

        bookingRepository.items.push({
            id: 'booking-01',
            client_id: clientId,
            provider_id: providerId,
            status: BookingStatus.COMPLETED,
        })

        const review = await sut.execute({
            bookingId: 'booking-01',
            reviewerId: clientId,
            rating: 5,
            comment: 'Excelente serviço!'
        })

        expect(review.id).toBeDefined()
        expect(review.rating).toBe(5)

        const updatedProvider = await userRepository.findById(providerId)
        expect(updatedProvider?.avgRating.toNumber()).toBe(5)
    })

    it('não deve permitir avaliar um serviço que não pertence ao cliente', async () => {
        bookingRepository.items.push({
            id: 'booking-01',
            client_id: 'outro-cliente-id',
            status: BookingStatus.COMPLETED,
        })

        await expect(
            sut.execute({
                bookingId: 'booking-01',
                reviewerId: 'cliente-tentando-fraudar',
                rating: 5
            })
        ).rejects.toThrow('Forbidden')
    })

    it('não deve permitir avaliar um serviço que não está concluído', async () => {
        bookingRepository.items.push({
            id: 'booking-01',
            client_id: 'client-01',
            status: BookingStatus.SCHEDULED
        })

        await expect(
            sut.execute({
                bookingId: 'booking-01',
                reviewerId: 'client-01',
                rating: 5
            })
        ).rejects.toThrow('Booking not completed')
    })

    it('não deve permitir avaliar o mesmo agendamento duas vezes', async () => {
        const bookingId = 'booking-01'
        const clientId = 'client-01'

        bookingRepository.items.push({
            id: bookingId,
            client_id: clientId,
            provider_id: 'provider-01',
            status: BookingStatus.COMPLETED,
        })

        await sut.execute({ bookingId, reviewerId: clientId, rating: 4})

        await expect(() => 
            sut.execute({bookingId, reviewerId: clientId, rating: 5})
        ).rejects.toThrow('Review already exists')
    })
})