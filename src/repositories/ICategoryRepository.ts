export interface CategoryDTO {
    id: string
    name: string
}

export interface ICategoryRepository {
    findById(id: string): Promise<CategoryDTO | null>
}