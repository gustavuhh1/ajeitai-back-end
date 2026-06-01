import { describe, it, expect, beforeEach } from "vitest";
import { CreateBudgetUseCase } from "../../budgets/CreateBudgetUseCase";
import { InMemoryBudgetRepository } from "../../../repositories/in-memory/InMemoryBudgetRepository";
import { InMemoryServiceRepository } from "../../../repositories/in-memory/InMemoryServiceRepository";
import { Service } from "../../../entities/Service";
import { Address } from "@/entities/Address";
import { InMemoryAddressRepository } from "@/repositories/in-memory/InMemoryAddressRepository";

describe("CreateBudgetUseCase", () => {
  let inMemoryBudgetRepository: InMemoryBudgetRepository;
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let sut: CreateBudgetUseCase;

  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new CreateBudgetUseCase(inMemoryBudgetRepository, inMemoryServiceRepository);

    const address = new Address(
      {
        rua: "Rua 1",
        numero: "1",
        ponto_de_referencia: "Ponto 1",
        cep: "12345678",
        complemento: "Complemento 1",
        cidade: "Cidade 1",
        estado: "Estado 1",
        latitude: 1,
        longitude: 1,
        principal: true,
        user_id: "client-1",
      },
      "address-1",
    );
    inMemoryAddressRepository.create(address);
  });

  it("deve ser possível criar um novo orçamento para um serviço aberto", async () => {
    inMemoryServiceRepository.items.push(
      new Service({
        id: "service-1",
        title: "Plumbing",
        description: "Fix pipes",
        categoryIds: ["cat-1"],
        client_id: "client-1",
        address_id: "address-1",
        status: "ABERTO",
      }),
    );

    const budget = await sut.execute({
      serviceId: "service-1",
      providerId: "provider-1",
      price: 150,
      description: "I can fix it tomorrow",
      estimatedDate: new Date(),
    });

    expect(budget.id).toBeDefined();
    expect(budget.status).toBe("AGUARDANDO_CLIENTE");
    expect(inMemoryBudgetRepository.items).toHaveLength(1);
  });

  it("não deve ser possível criar um orçamento para um serviço inexistente", async () => {
    await expect(() =>
      sut.execute({
        serviceId: "non-existent-service",
        providerId: "provider-1",
        price: 150,
        description: "I can fix it tomorrow",
        estimatedDate: new Date(),
      }),
    ).rejects.toThrow("Serviço não encontrado");
  });

  it("não deve ser possível criar um orçamento para um serviço que não está aberto", async () => {
    inMemoryServiceRepository.items.push(
      new Service({
        id: "service-2",
        title: "Plumbing",
        description: "Fix pipes",
        categoryIds: ["cat-1"],
        client_id: "client-1",
        address_id: "address-1",
        status: "APROVADO",
      }),
    );

    await expect(() =>
      sut.execute({
        serviceId: "service-2",
        providerId: "provider-1",
        price: 150,
        description: "I can fix it tomorrow",
        estimatedDate: new Date(),
      }),
    ).rejects.toThrow(
      "Não é possível enviar orçamento para um serviço que não está aberto",
    );
  });
});
