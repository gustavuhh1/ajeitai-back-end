import { describe, it, expect, beforeEach } from "vitest";
import { ListProviderBudgetsUseCase } from "../../budgets/ListProviderBudgetsUseCase";
import { InMemoryBudgetRepository } from "../../../repositories/in-memory/InMemoryBudgetRepository";
import { Budget } from "../../../entities/Budget";

describe("ListProviderBudgetsUseCase", () => {
  let budgetRepository: InMemoryBudgetRepository;
  let sut: ListProviderBudgetsUseCase;

  beforeEach(() => {
    budgetRepository = new InMemoryBudgetRepository();
    sut = new ListProviderBudgetsUseCase(budgetRepository);
  });

  it("deve retornar todos os orçamentos enviados por um prestador específico", async () => {
    budgetRepository.items.push(
      new Budget({
        id: "budget-1",
        price: 150.0,
        description: "Orçamento 1",
        estimatedDate: new Date(),
        serviceId: "service-1",
        providerId: "provider-1",
      }),
      new Budget({
        id: "budget-2",
        price: 200.0,
        description: "Orçamento 2",
        estimatedDate: new Date(),
        serviceId: "service-2",
        providerId: "provider-2",
      }),
      new Budget({
        id: "budget-3",
        price: 300.0,
        description: "Orçamento 3",
        estimatedDate: new Date(),
        serviceId: "service-3",
        providerId: "provider-1",
      })
    );

    const budgets = await sut.execute({ providerId: "provider-1" });

    expect(budgets).toHaveLength(2);
    expect(budgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "budget-1" }),
        expect.objectContaining({ id: "budget-3" }),
      ])
    );
    expect(budgets[0]).toHaveProperty("service");
    expect(budgets[0].service).toHaveProperty("client");
  });
});
