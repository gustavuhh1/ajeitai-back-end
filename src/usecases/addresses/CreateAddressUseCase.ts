import { Address } from "../../entities/Address";
import { IAddressRepository } from "../../repositories/IAddressRepository";

export interface CreateAddressRequest {
  apelido: string;
  rua: string;
  numero: string;
  cep: string;
  complemento?: string;
  cidade: string;
  estado: string;
  bairro: string;
  latitude: number;
  longitude: number;
  principal?: boolean;
  user_id: string;
}

export class CreateAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(request: CreateAddressRequest): Promise<Address> {
    const addressCount = await this.addressRepository.countByUserId(request.user_id);

    if (addressCount >= 5) {
      throw new Error("O usuário não pode ter mais de 5 endereços");
    }

    let isPrincipal = request.principal ?? false;

    // Se for o primeiro endereço, obriga a ser principal
    if (addressCount === 0) {
      isPrincipal = true;
    }

    const address = new Address({
      apelido: request.apelido,
      rua: request.rua,
      numero: request.numero,
      cep: request.cep,
      complemento: request.complemento,
      cidade: request.cidade,
      estado: request.estado,
      bairro: request.bairro,
      latitude: request.latitude,
      longitude: request.longitude,
      principal: isPrincipal,
      user_id: request.user_id,
    });

    await this.addressRepository.create(address);

    if (isPrincipal && addressCount > 0) {
      await this.addressRepository.togglePrincipal(address.id, request.user_id);
    }

    return address;
  }
}
