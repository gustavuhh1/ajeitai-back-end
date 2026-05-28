import { CategoryDTO, ICategoryRepository } from '../ICategoryRepository';

export class InMemoryCategoryRepository implements ICategoryRepository {
  public items: CategoryDTO[] = [];

  async findById(id: string): Promise<CategoryDTO | null> {
    const category = this.items.find(c => c.id === id);
    return category || null;
  }
}
