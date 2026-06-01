import { describe, it, expect, beforeEach } from "vitest";
import { CreateServiceUseCase } from "../../services/CreateServiceUseCase";
import { InMemoryServiceRepository } from "../../../repositories/in-memory/InMemoryServiceRepository";
import { InMemoryCategoryRepository } from "../../../repositories/in-memory/InMemoryCategoryRepository";
import { InMemoryAddressRepository } from "../../../repositories/in-memory/InMemoryAddressRepository";
import { Address } from "../../../entities/Address";

describe("CreateServiceUseCase", () => {
  let inMemoryServiceRepository: InMemoryServiceRepository;
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let sut: CreateServiceUseCase;

  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryServiceRepository = new InMemoryServiceRepository(
      undefined,
      undefined,
      inMemoryAddressRepository,
    );
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    sut = new CreateServiceUseCase(
      inMemoryServiceRepository,
      inMemoryCategoryRepository,
      inMemoryAddressRepository,
    );
  });

  it("deve ser possível criar um novo serviço", async () => {
    inMemoryCategoryRepository.items.push({ id: "cat-1", name: "Plumbing" });
    const address = new Address({
      user_id: "client-123",
      rua: "Rua das Flores",
      numero: "123",
      cidade: "New York",
      estado: "NY",
      cep: "12345-678",
      latitude: 0,
      longitude: 0,
      principal: true,
    });
    inMemoryAddressRepository.items.push(address);

    const service = await sut.execute({
      title: "Fix sink",
      description: "The kitchen sink is leaking.",
      categoryIds: ["cat-1"],
      client_id: "client-123",
      address_id: address.id,
    });

    expect(service.id).toBeDefined();
    expect(service.status).toBe("ABERTO");
    expect(inMemoryServiceRepository.items).toHaveLength(1);
    expect(inMemoryServiceRepository.items[0]!.client_id).toBe("client-123");
  });

  it("não deve ser possível criar um serviço com categorias inexistentes", async () => {
    const address = new Address({
      user_id: "client-123",
      rua: "Rua das Flores",
      numero: "123",
      cidade: "New York",
      estado: "NY",
      cep: "12345-678",
      latitude: 0,
      longitude: 0,
      principal: true,
    });
    inMemoryAddressRepository.items.push(address);

    await expect(() =>
      sut.execute({
        title: "Fix sink",
        description: "The kitchen sink is leaking.",
        categoryIds: ["non-existent-cat"],
        client_id: "client-123",
        address_id: address.id,
      }),
    ).rejects.toThrow("Uma ou mais categorias informadas não foram encontradas");
  });
});
