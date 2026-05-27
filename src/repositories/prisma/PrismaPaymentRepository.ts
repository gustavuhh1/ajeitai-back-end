import {prisma} from '@/utils/prisma'
import { IPaymentRepository } from '../IPaymentRepository'
import { Payment, Prisma } from '@prisma/client'

export class PrismaPaymentRepository implements IPaymentRepository {
    async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
        const payment = await prisma.payment.create({
            data
        })

        return payment
    }
}
