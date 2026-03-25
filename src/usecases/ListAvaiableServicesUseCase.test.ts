import {describe, it, expect, beforeEach} from 'vitest'
import { ListAvaiableServicesUseCase } from './ListAvaiableServicesUseCase'
import { InMemoryServiceRepository } from '@/repositories/in-memory/in-memory-service-repository'
import { Service } from '@/entities/Service'

let serviceRepository: InMemoryServiceRepository
let sut: ListAvaiableServicesUseCase

describe('List Avaiable Services Use Case', ()=> {
    beforeEach(()=> {
        serviceRepository = new InMemoryServiceRepository()
        sut = new ListAvaiableServicesUseCase(serviceRepository)
    })

    it('should be services filter by city', async ()=> {
        await serviceRepository.create(new Service({
            title: 'Serviço 01',
            description: 'Descrição Longa o Suficiente',
            category_id: 'cat-01',
            client_id: 'cli-01',
            city: 'Fortaleza'
        }))

        await serviceRepository.create(new Service({
            title: 'Serviço 02',
            description: 'Descrição longa o suficiente',
            category_id: 'cat-01',
            client_id: 'cli-01',
            city: 'Caucaia'
        }))

        const { items} = await sut.execute({city: 'Fortaleza', page: 1, limit: 10})

        expect(items).toHaveLength(1)
        expect(items[0]?.city).toBe('Fortaleza')
    })
})