import { describe, it, expect, beforeEach } from "vitest";
import { TogglePrincipalAddressUseCase } from "../../addresses/TogglePrincipalAddressUseCase";
import { InMemoryAddressRepository } from "../../../repositories/in-memory/InMemoryAddressRepository";
import { Address } from "../../../entities/Address";

describe("TogglePrincipalAddressUseCase", () => {
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let sut: TogglePrincipalAddressUseCase;

  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new TogglePrincipalAddressUseCase(inMemoryAddressRepository);
  });

  it("deve ser possível definir um endereço como principal", async () => {
    const address1 = new Address(
      {
        rua: "Rua A",
        numero: "1",
        cep: "11111111",
        cidade: "Cidade A",
        estado: "Estado A",
        latitude: 0,
        longitude: 0,
        principal: true,
        user_id: "user-1",
      },
      "address-1"
    );

    const address2 = new Address(
      {
        rua: "Rua B",
        numero: "2",
        cep: "22222222",
        cidade: "Cidade B",
        estado: "Estado B",
        latitude: 0,
        longitude: 0,
        principal: false,
        user_id: "user-1",
      },
      "address-2"
    );

    inMemoryAddressRepository.create(address1);
    inMemoryAddressRepository.create(address2);

    await sut.execute({
      addressId: "address-2",
      userId: "user-1",
    });

    const updatedAddress1 = await inMemoryAddressRepository.findById("address-1");
    const updatedAddress2 = await inMemoryAddressRepository.findById("address-2");

    expect(updatedAddress1?.principal).toBe(false);
    expect(updatedAddress2?.principal).toBe(true);
  });

  it("não deve fazer nada se o endereço já for o principal", async () => {
    const address1 = new Address(
      {
        rua: "Rua A",
        numero: "1",
        cep: "11111111",
        cidade: "Cidade A",
        estado: "Estado A",
        latitude: 0,
        longitude: 0,
        principal: true,
        user_id: "user-1",
      },
      "address-1"
    );

    inMemoryAddressRepository.create(address1);

    await sut.execute({
      addressId: "address-1",
      userId: "user-1",
    });

    const updatedAddress1 = await inMemoryAddressRepository.findById("address-1");
    expect(updatedAddress1?.principal).toBe(true);
  });

  it("não deve ser possível definir como principal um endereço inexistente", async () => {
    await expect(() =>
      sut.execute({
        addressId: "non-existent-address",
        userId: "user-1",
      })
    ).rejects.toThrow("Endereço não encontrado.");
  });

  it("não deve ser possível definir como principal um endereço de outro usuário", async () => {
    const address1 = new Address(
      {
        rua: "Rua A",
        numero: "1",
        cep: "11111111",
        cidade: "Cidade A",
        estado: "Estado A",
        latitude: 0,
        longitude: 0,
        principal: true,
        user_id: "user-2",
      },
      "address-1"
    );

    inMemoryAddressRepository.create(address1);

    await expect(() =>
      sut.execute({
        addressId: "address-1",
        userId: "user-1",
      })
    ).rejects.toThrow("Operação não permitida.");
  });
});
