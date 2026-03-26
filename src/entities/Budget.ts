import { randomUUID } from 'node:crypto'

export interface BudgetProps {
    id?: string
    serviceId: string
    providerId: string
    price: number
    description: string
    estimatedDate: Date
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    createdAt?: Date
    updatedAt?: Date
}

export class Budget {
    private props: BudgetProps

    constructor(props: BudgetProps) {
        if (props.price <= 0) {
            throw new Error("O preço da proposta deve ser maior que zero")
        }

        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            status: props.status ?? 'PENDING',
        }
    }

    get id() { return this.props.id }
    get serviceId() { return this.props.serviceId }
    get providerId() { return this.props.providerId }
    get price() { return this.props.price }
    get description() { return this.props.description }
    get estimatedDate() { return this.props.estimatedDate }
    get status() { return this.props.status }
}