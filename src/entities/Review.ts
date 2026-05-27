import { randomUUID } from 'node:crypto'

export interface ReviewProps {
    id?: string
    rating: number
    comment?: string | null
    serviceId: string
    reviewerId: string
    createdAt?: Date
}

export class Review {
    private props: ReviewProps

    constructor(props: ReviewProps) {
        if (props.rating < 1 || props.rating > 5) {
            throw new Error("A avaliação deve ser entre 1 e 5 estrelas")
        }

        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            comment: props.comment ?? null,
            createdAt: props.createdAt ?? new Date()
        }
    }

    get id() { return this.props.id }
    get rating() { return this.props.rating }
    get comment() { return this.props.comment }
    get serviceId() { return this.props.serviceId }
    get reviewerId() { return this.props.reviewerId }
    get createdAt() { return this.props.createdAt }
}
