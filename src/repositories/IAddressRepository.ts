import { Address } from "../entities/Address";

export interface IAddressRepository {
  create(address: Address): Promise<void>;
  findByUserId(userId: string): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  countByUserId(userId: string): Promise<number>;
  delete(id: string): Promise<void>;
  togglePrincipal(addressId: string, userId: string): Promise<void>;
}
