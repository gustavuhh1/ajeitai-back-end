import { Address } from "../../entities/Address";
import { IAddressRepository } from "../IAddressRepository";

export class InMemoryAddressRepository implements IAddressRepository {
  public items: Address[] = [];

  async create(address: Address): Promise<void> {
    this.items.push(address);
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return this.items
      .filter((item) => item.user_id === userId)
      .sort((a, b) => {
        if (a.principal && !b.principal) return -1;
        if (!a.principal && b.principal) return 1;
        return 0;
      });
  }

  async findById(id: string): Promise<Address | null> {
    const address = this.items.find((item) => item.id === id);
    return address ?? null;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((item) => item.user_id === userId).length;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }

  async togglePrincipal(addressId: string, userId: string): Promise<void> {
    this.items.forEach((item) => {
      if (item.user_id === userId) {
        if (item.id === addressId) {
          item.principal = true;
        } else if (item.principal) {
          item.principal = false;
        }
      }
    });
  }
}
