import { IAddressRepository } from "../../repositories/IAddressRepository";

export interface TogglePrincipalAddressRequest {
  addressId: string;
  userId: string;
}

export class TogglePrincipalAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute({ addressId, userId }: TogglePrincipalAddressRequest): Promise<void> {
    const address = await this.addressRepository.findById(addressId);

    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    if (address.user_id !== userId) {
      throw new Error("Operação não permitida.");
    }

    if (address.principal) {
      // Já é o principal, não precisa fazer nada
      return;
    }

    await this.addressRepository.togglePrincipal(addressId, userId);
  }
}
