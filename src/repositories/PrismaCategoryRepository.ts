import {prisma} from '@/utils/prisma'
import { ICategoryRepository } from './ICategoryRepository'

export class PrismaCategoryRepository implements ICategoryRepository {
    async findById(id: string) {
        return await prisma.category.findUnique({
            where: {id}
        })
    }
}