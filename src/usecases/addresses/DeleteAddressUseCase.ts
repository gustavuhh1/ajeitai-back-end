import { IAddressRepository } from "../../repositories/IAddressRepository";
import { IServiceRepository } from "../../repositories/IServiceRepository";

export class DeleteAddressUseCase {
  constructor(
    private addressRepository: IAddressRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute(addressId: string, userId: string): Promise<void> {
    const address = await this.addressRepository.findById(addressId);

    if (!address) {
      throw new Error("Endereço não encontrado");
    }

    if (address.user_id !== userId) {
      throw new Error("Usuário não tem permissão para deletar este endereço");
    }

    // Regra de negócio: não pode deletar se houver serviços atrelados
    const count = await this.serviceRepository.countByAddressId(addressId);
    if (count > 0) {
      throw new Error("Não é possível deletar um endereço que possui serviços vinculados");
    }

    await this.addressRepository.delete(addressId);
  }
}
