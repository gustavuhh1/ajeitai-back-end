import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateBookingStatusUseCase } from './UpdateBookingStatusUseCase'
import { InMemoryBookingRepository } from '@/repositories/in-memory/in-memory-booking-repository'
import { BookingStatus } from '@prisma/client'

let bookingRepository: InMemoryBookingRepository
let sut: UpdateBookingStatusUseCase

describe('Update Booking Status Use Case', () => {
  beforeEach(() => {
    bookingRepository = new InMemoryBookingRepository()
    sut = new UpdateBookingStatusUseCase(bookingRepository)
  })

  it('deve ser capaz de realizar o check-in (SCHEDULED -> IN_PROGRESS)', async () => {
    const booking = await bookingRepository.save({
      id: 'booking-1',
      provider_id: 'provider-1',
      status: BookingStatus.SCHEDULED,
      scheduleAt: new Date(),
    } as any)

    const updatedBooking = await sut.execute({
      bookingId: 'booking-1',
      providerId: 'provider-1',
      newStatus: BookingStatus.IN_PROGRESS
    })

    expect(updatedBooking.status).toBe(BookingStatus.IN_PROGRESS)
    expect(bookingRepository.items[0].status).toBe(BookingStatus.IN_PROGRESS)
  })

  it('deve ser capaz de realizar o check-out (IN_PROGRESS -> COMPLETED)', async () => {
    await bookingRepository.save({
      id: 'booking-1',
      provider_id: 'provider-1',
      status: BookingStatus.IN_PROGRESS,
    } as any)

    const updatedBooking = await sut.execute({
      bookingId: 'booking-1',
      providerId: 'provider-1',
      newStatus: BookingStatus.COMPLETED
    })

    expect(updatedBooking.status).toBe(BookingStatus.COMPLETED)
  })

  it('não deve permitir pular de SCHEDULED direto para COMPLETED', async () => {
    await bookingRepository.save({
      id: 'booking-1',
      provider_id: 'provider-1',
      status: BookingStatus.SCHEDULED,
    } as any)

    await expect(
      sut.execute({
        bookingId: 'booking-1',
        providerId: 'provider-1',
        newStatus: BookingStatus.COMPLETED
      })
    ).rejects.toThrow('Invalid status transition')
  })

  it('não deve permitir que outro prestador altere o status', async () => {
    await bookingRepository.save({
      id: 'booking-1',
      provider_id: 'prestador-real',
      status: BookingStatus.SCHEDULED,
    } as any)

    await expect(
      sut.execute({
        bookingId: 'booking-1',
        providerId: 'prestador-impostor',
        newStatus: BookingStatus.IN_PROGRESS
      })
    ).rejects.toThrow('Forbidden')
  })
})