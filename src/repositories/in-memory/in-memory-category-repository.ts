import { CategoryDTO, ICategoryRepository } from "../ICategoryRepository";

export class InMemoryCategoryRepository implements ICategoryRepository {
    public items: {id: string, name: string} [] = []

    async findById(id: string): Promise<CategoryDTO | null> {
        const category = this.items.find(item => item.id === id)
        return category || null
    }

    async create(name: string) {
        const category = {id: crypto.randomUUID(), name}
        this.items.push(category)
        return category
    }
}