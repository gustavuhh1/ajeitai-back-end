import { prisma } from "@/utils/prisma";
import { Budget as BudgetEntity } from "@/entities/Budget";
import { IBudgetRepository, BudgetWithProvider } from "./IBudgetRepository";
import { Prisma } from "@prisma/client";

export class PrismaBudgetRepository implements IBudgetRepository {
  async create(budget: BudgetEntity) {
    await prisma.budget.create({
      data: {
        id: budget.id,
        description: budget.description,
        price: new Prisma.Decimal(budget.price),
        estimatedDate: budget.estimatedDate,
        status: budget.status,
        serviceId: budget.serviceId,
        providerId: budget.providerId,
      },
    });
  }

  async acceptBudget(budgetId: string, serviceId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const acceptedBudget = await tx.budget.update({
        where: { id: budgetId },
        data: { status: "ACEITO" },
      });

      await tx.budget.updateMany({
        where: {
          serviceId: serviceId,
          id: { not: budgetId },
          status: { in: ["AGUARDANDO_CLIENTE", "AGUARDANDO_PRESTADOR"] },
        },
        data: { status: "RECUSADO" },
      });

      await tx.service.update({
        where: { id: serviceId },
        data: {
          status: "AGUARDANDO_PAGAMENTO",
          provider_id: acceptedBudget.providerId,
        },
      });
    });
  }

  async findById(id: string): Promise<BudgetEntity | null> {
    const budgetData = await prisma.budget.findUnique({
      where: { id },
    });

    if (!budgetData) return null;

    return new BudgetEntity({
      id: budgetData.id,
      serviceId: budgetData.serviceId,
      providerId: budgetData.providerId,
      price: Number(budgetData.price),
      description: budgetData.description,
      estimatedDate: budgetData.estimatedDate,
      status: budgetData.status as any,
      createdAt: budgetData.createdAt,
      updatedAt: budgetData.updatedAt,
    });
  }

  async findManyByServiceIdWithProvider(
    serviceId: string,
  ): Promise<BudgetWithProvider[]> {
    const budgets = await prisma.budget.findMany({
      where: { serviceId },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return budgets.map((item) => ({
      id: item.id,
      price: Number(item.price),
      description: item.description,
      estimatedDate: item.estimatedDate,
      status: item.status,
      createdAt: item.createdAt,
      provider: {
        id: item.provider.id,
        name: item.provider.name,
        description: item.provider.description,
      },
    }));
  }
}
