import { describe, it, expect, beforeEach } from 'vitest';
import { AcceptBudgetUseCase } from './AcceptBudgetUseCase';
import { InMemoryBudgetRepository } from '@/repositories/in-memory/in-memory-budget-repository';
import { InMemoryServiceRepository } from '@/repositories/in-memory/in-memory-service-repository';
import { Service } from '@/entities/Service';
import { Budget } from '@/entities/Budget';

let budgetRepository: InMemoryBudgetRepository;
let serviceRepository: InMemoryServiceRepository;
let sut: AcceptBudgetUseCase;

describe('Accept Budget Use Case', () => {
    beforeEach(() => {
        budgetRepository = new InMemoryBudgetRepository();
        serviceRepository = new InMemoryServiceRepository();
        sut = new AcceptBudgetUseCase(budgetRepository, serviceRepository);
    });

    it('deve ser capaz de aceitar uma proposta e gerar um agendamento', async () => {
        const serviceId = 'service-01';
        const budgetId = 'budget-01';
        const clientId = 'client-01';

        const service = new Service({
                id: serviceId,
                client_id: clientId,
                title: 'Serviço de Teste',
                description: 'Descrição de Teste',
                category_id: 'cat-01',
                city: 'Fortaleza',
                status: 'PENDING'

            });

        await serviceRepository.create(service);

        budgetRepository.items.push({
            id: budgetId,
            serviceId,
            status: 'PENDING',
            estimatedDate: new Date(),
            providerId: 'provider-01'
        });

        const { booking } = await sut.execute({
            clientId,
            serviceId,
            budgetId
        });

        expect(booking.id).toBeDefined();
        expect(budgetRepository.items[0].status).toBe('ACCEPTED');
    });

    it('não deve permitir aceitar uma proposta de um serviço que não pertence ao cliente', async () => {
       const service = new Service({
            id: 'service-01',
            client_id: 'outro-cliente',
            title: 'Serviço de Teste',
            description: 'Descrição',
            category_id: 'cat-01',
            city: 'Fortaleza'
        });
        
        await serviceRepository.create(service);
        
        budgetRepository.items.push({ id: 'budget-01', serviceId: 'service-01', status: 'PENDING' });

        await expect(() => 
            sut.execute({ clientId: 'cliente-real', serviceId: 'service-01', budgetId: 'budget-01' })
        ).rejects.toThrow('Forbidden');
    });
});