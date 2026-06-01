import { describe, it, expect, beforeEach } from "vitest";
import { ListAvailableServicesUseCase } from "../../services/ListAvailableServicesUseCase";
import { InMemoryServiceRepository } from "../../../repositories/in-memory/InMemoryServiceRepository";
import { InMemoryAddressRepository } from "../../../repositories/in-memory/InMemoryAddressRepository";
import { Service } from "../../../entities/Service";
import { Address } from "../../../entities/Address";

describe("ListAvailableServicesUseCase", () => {
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let sut: ListAvailableServicesUseCase;

  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryServiceRepository = new InMemoryServiceRepository(
      undefined,
      undefined,
      inMemoryAddressRepository,
    );
    sut = new ListAvailableServicesUseCase(inMemoryServiceRepository);
  });

  it("deve ser possível listar todos os serviços disponíveis sem filtros", async () => {
    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 1",
        description: "Desc 1",
        categoryIds: ["cat-1"],
        client_id: "client-1",
        address_id: "address-1",
        status: "ABERTO",
      }),
    );

    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 2",
        description: "Desc 2",
        categoryIds: ["cat-2"],
        client_id: "client-2",
        address_id: "address-2",
        status: "ABERTO",
      }),
    );

    const result = await sut.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("deve ser possível filtrar serviços por cidade", async () => {
    inMemoryAddressRepository.items.push(
      new Address(
        {
          user_id: "client-1",
          rua: "Rua A",
          numero: "1",
          cidade: "City A",
          estado: "Estado A",
          cep: "11111-111",
          latitude: 0,
          longitude: 0,
          principal: true,
        },
        "address-1",
      ),
    );

    inMemoryAddressRepository.items.push(
      new Address(
        {
          user_id: "client-2",
          rua: "Rua B",
          numero: "2",
          cidade: "City B",
          estado: "Estado B",
          cep: "22222-222",
          latitude: 0,
          longitude: 0,
          principal: true,
        },
        "address-2",
      ),
    );

    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 1",
        description: "Desc 1",
        categoryIds: ["cat-1"],
        client_id: "client-1",
        address_id: "address-1",
        status: "ABERTO",
      }),
    );

    inMemoryServiceRepository.items.push(
      new Service({
        title: "Service 2",
        description: "Desc 2",
        categoryIds: ["cat-2"],
        client_id: "client-2",
        address_id: "address-2",
        status: "ABERTO",
      }),
    );

    const result = await sut.execute({ page: 1, limit: 10, city: "City A" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.address_id).toBe("address-1");
  });
});
