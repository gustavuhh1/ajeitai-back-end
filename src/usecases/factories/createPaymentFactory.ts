import { PrismaPaymentRepository } from "@/repositories/prisma/PrismaPaymentRepository";
import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { CreatePaymentUseCase } from "../payments/CreatePaymentUseCase";

export function createPaymentFactory() {
  const paymentRepository = new PrismaPaymentRepository();
  const budgetRepository = new PrismaBudgetRepository();
  return new CreatePaymentUseCase(paymentRepository, budgetRepository);
}

