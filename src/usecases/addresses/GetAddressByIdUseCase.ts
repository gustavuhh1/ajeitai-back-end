import { IAddressRepository } from "@/repositories/IAddressRepository";
import { Address } from "@/entities/Address";

export class GetAddressByIdUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(id: string, userId: string): Promise<Address> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    if (address.user_id !== userId) {
      throw new Error("Você não tem permissão para acessar este endereço.");
    }

    return address;
  }
}
