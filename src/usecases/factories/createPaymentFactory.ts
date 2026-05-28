import { PrismaPaymentRepository } from "@/repositories/prisma/PrismaPaymentRepository";
import { CreatePaymentUseCase } from "../payments/CreatePaymentUseCase";

export function createPaymentFactory() {
  const paymentRepository = new PrismaPaymentRepository();
  return new CreatePaymentUseCase(paymentRepository);
}

