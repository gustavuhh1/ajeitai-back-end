import {expect, describe, it, beforeEach} from 'vitest'
import { Service } from '@/entities/Service'
import { InMemoryServiceRepository } from '@/repositories/in-memory/in-memory-service-repository'
import { GetServiceByIdUseCase } from './GetServiceByIdUseCase'

let serviceRepository: InMemoryServiceRepository
let sut: GetServiceByIdUseCase

describe('Get Service By Id Use Case', ()=> {
    beforeEach(()=> {
        serviceRepository = new InMemoryServiceRepository()
        sut = new GetServiceByIdUseCase(serviceRepository)
    })

    it('should be able to get service details', async ()=> {
        const newService = new Service({
            title: 'Limpeza de Ar Condicionado',
            description: 'Limpeza completa',
            category_id: 'cat-1',
            client_id: 'user-1',
            city: 'Fortaleza',
            status: 'UNDER_ANALYSIS', // Adicione os campos que sua entidade exige
            latitude: -3.7319,
            longitude: -38.5267
    })

        await serviceRepository.create(newService)

        const service = await sut.execute(newService.id!)

        expect(service.id).toEqual(expect.any(String))
        expect(service.title).toBe('Limpeza de Ar Condicionado')
    })

    it('should not be able to get service with wrong id', async ()=> {
        await expect(()=> 
            sut.execute('not-existing-id')
        ).rejects.toBeInstanceOf(Error)
    })
})