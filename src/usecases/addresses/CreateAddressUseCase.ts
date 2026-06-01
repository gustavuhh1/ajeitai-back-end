import { Address } from "../../entities/Address";
import { IAddressRepository } from "../../repositories/IAddressRepository";

export interface CreateAddressRequest {
  rua: string;
  numero: string;
  ponto_de_referencia?: string;
  cep: string;
  complemento?: string;
  cidade: string;
  estado: string;
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
      rua: request.rua,
      numero: request.numero,
      ponto_de_referencia: request.ponto_de_referencia,
      cep: request.cep,
      complemento: request.complemento,
      cidade: request.cidade,
      estado: request.estado,
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
