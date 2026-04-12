import {describe, it, expect, beforeEach} from 'vitest'
import { InMemoryBookingRepository } from '@/repositories/in-memory/in-memory-booking-repository'
import { ListProviderBookingsUseCase } from './ListProviderBookingsUseCase'
import { BookingStatus } from '@prisma/client'

let bookingRepository: InMemoryBookingRepository
let sut: ListProviderBookingsUseCase

describe('List Provider Bookings Use Case', ()=> {
    beforeEach(()=> {
        bookingRepository = new InMemoryBookingRepository()
        sut = new ListProviderBookingsUseCase(bookingRepository)
    })

    it('should be able to list schedules of provider', async () => {
        bookingRepository.items.push({
            id: 'booking-1',
            scheduleAt: new Date(),
            status: BookingStatus.SCHEDULED,
            provider_id: 'provider-01',
            client: {id: 'client-01', name: 'Emanuel Marinho'},
            service: {
                id: 'service-01',
                title: 'Manutenção de PC',
                neighborhood: 'Papicu',
                city: 'Fortaleza'
            },
        })

        const {items, total} = await sut.execute({
            providerId: 'provider-01'
        })

        expect(total).toBe(1)
        expect(items[0]).toMatchObject({
            id: 'booking-1',
            service: {
                title: 'Manutenção de PC',
                location: 'Papicu, Fortaleza'
            }
        })
    })

    it('should be filter schedules by status', async () => {
        bookingRepository.items.push({
            id: 'booking-01',
            status: BookingStatus.SCHEDULED,
            provider_id: 'provider-01',
            client: { name: 'João'},
            service: { title: 'Serviço A', city: 'Fortaleza'}
        })

        bookingRepository.items.push({
            id: 'booking-2',
            status: BookingStatus.COMPLETED,
            provider_id: 'provider-01',
            client: {name: 'Maria'},
            service: {title: 'Serviço B', city: 'Fortaleza'}
        })

        const {items} = await sut.execute({
            providerId: 'provider-01',
            status: BookingStatus.COMPLETED
        })

        expect(items).toHaveLength(1)
        expect(items[0]?.status).toBe(BookingStatus.COMPLETED)
    })

    it('should not be schedule by another provider', async ()=> {
        bookingRepository.items.push({
            id: 'booking-other',
            provider_id: 'provider-02',
            client: {name: 'Zezin'},
            service: {title: 'Serviço X', city: 'Fortaleza'}
        })

        const {items} = await sut.execute({
            providerId: 'provider-01'
        })

        expect(items).toHaveLength(0)
    })
})
