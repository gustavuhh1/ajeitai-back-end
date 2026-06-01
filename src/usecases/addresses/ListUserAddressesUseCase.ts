import { Address } from "../../entities/Address";
import { IAddressRepository } from "../../repositories/IAddressRepository";

export class ListUserAddressesUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string): Promise<Address[]> {
    return this.addressRepository.findByUserId(userId);
  }
}
