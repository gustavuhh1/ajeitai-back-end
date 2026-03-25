import {describe, it, expect, beforeEach} from 'vitest'
import { CreateServiceUseCase } from './CreateServiceUseCase'
import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryServiceRepository } from '@/repositories/in-memory/in-memory-service-repository'

let serviceRepository: InMemoryServiceRepository
let categoryRepository: InMemoryCategoryRepository
let sut: CreateServiceUseCase

describe('Create Service Use Case', ()=> {
    beforeEach(()=> {
        serviceRepository = new InMemoryServiceRepository()
        categoryRepository = new InMemoryCategoryRepository()
        sut = new CreateServiceUseCase(serviceRepository, categoryRepository)
    })

    it('should be create a service with full location', async ()=> {
        const category = await categoryRepository.create('Encanamento')

        const service = await sut.execute({
            title: 'Vazamento na Cozinha',
            description: 'Preciso de reparo urgente no cano da pia',
            category_id: category.id,
            client_id: 'user-client-id',
            city: 'Fortaleza',
            neighborhood: 'Aldeota',
            latitude: -3.7327,
            longitude: -38.5270
        })

        expect(service.id).toEqual(expect.any(String))
        expect(serviceRepository.items[0]?.city).toBe('Fortaleza')
    })

    it('should not be create a service if the category does not exist', async ()=> {
        await expect(()=> 
            sut.execute({
                title: 'Titulo teste',
                description: 'Descrição com mais de 10 caractere',
                category_id: 'id-inexistente',
                client_id: 'user-client-id',
                city: 'Fortaleza'
            })
        ).rejects.toThrow('Categoria não encontrada')
    })
})