import {prisma} from '@/utils/prisma'
import { Service } from '@/entities/Service'
import { IServiceRepository, ListServicesFilters, ListServicesResponse } from './IServiceRepository'

export class PrismaServiceRepository implements IServiceRepository {
    async create(service: Service) {
        await prisma.service.create({
            data: {
                id: service.id,
                title: service.title,
                description: service.description,
                category_id: service.category_id,
                client_id: service.client_id,
                status: service.status,
                city: service.city
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
            status: serviceData.status as any,
            city: serviceData.city,
            latitude: serviceData.latitude,
            longitude: serviceData.longitude,
            neighborhood: serviceData.neighborhood
        })
    }

    async findAllAvailable({category_id, city, page, limit}: ListServicesFilters): Promise<ListServicesResponse> {
        const skip = (page -1) * limit

        const where = {
            status: 'UNDER_ANALYSIS' as any,
            category_id: category_id || undefined,
            city: city? {contains: city, mode: 'insensitive' as any}: undefined
        }

        const [serviceData, total] = await prisma.$transaction([
            prisma.service.findMany({
                where,
                take: limit,
                skip,
                orderBy: { id: 'desc'},
                include: { category: true}
            }),
            prisma.service.count({where})
        ])

        const items = serviceData.map(data => new Service({
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status as any,
            category_id: data.category_id,
            client_id: data.client_id,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            neighborhood: data.neighborhood
        }))

        return { items, total}
    }
}