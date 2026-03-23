import {prisma} from '@/utils/prisma'
import { Service } from '@/entities/Service'
import { IServiceRepository } from './IServiceRepository'

export class PrismaServiceRepository implements IServiceRepository {
    async create(service: Service) {
        await prisma.service.create({
            data: {
                id: service.id,
                title: service.title,
                description: service.description,
                category_id: service.category_id,
                client_id: service.client_id,
                status: service.status
                
            }
        })
    }

    async findById(id: string) {
        const serviceData = await prisma.service.findUnique({
            where: {id}
        })

        if(!serviceData) return null

        return new Service({
            id: serviceData.id,
            title: serviceData.title,
            description: serviceData.description,
            category_id: serviceData.category_id,
            client_id: serviceData.client_id,
            provider_id: serviceData.provider_id,
            start_date: serviceData.start_date,
            end_date: serviceData.end_date,
            status: serviceData.status as any
        })
    }
}