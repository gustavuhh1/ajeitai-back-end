import { describe, it, expect, beforeEach } from "vitest";
import { ListAvailableServicesUseCase } from "../../services/ListAvailableServicesUseCase";
import { InMemoryServiceRepository } from "../../../repositories/in-memory/InMemoryServiceRepository";
import { Service } from "../../../entities/Service";

describe("ListAvailableServicesUseCase", () => {
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let sut: ListAvailableServicesUseCase;

  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository();
    sut = new ListAvailableServicesUseCase(inMemoryServiceRepository);
  });

  it("deve ser possível listar todos os serviços disponíveis sem filtros", async () => {
    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 1",
        description: "Desc 1",
        categoryIds: ["cat-1"],
        client_id: "client-1",
        city: "City A",
        status: "ABERTO",
      }),
    );

    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 2",
        description: "Desc 2",
        categoryIds: ["cat-2"],
        client_id: "client-2",
        city: "City B",
        status: "ABERTO",
      }),
    );

    const result = await sut.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("deve ser possível filtrar serviços por cidade", async () => {
    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 1",
        description: "Desc 1",
        categoryIds: ["cat-1"],
        client_id: "client-1",
        city: "City A",
        status: "ABERTO",
      }),
    );

    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 2",
        description: "Desc 2",
        categoryIds: ["cat-2"],
        client_id: "client-2",
        city: "City B",
        status: "ABERTO",
      }),
    );

    const result = await sut.execute({ page: 1, limit: 10, city: "City A" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.city).toBe("City A");
  });
});
