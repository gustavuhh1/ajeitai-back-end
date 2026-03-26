import { randomUUID } from 'node:crypto'

export interface BudgetProps {
    id?: string
    value: number
    approval?: boolean
    service_id: string
}

export class Budget {
    private props: BudgetProps

    constructor(props: BudgetProps) {
        if (props.value <= 0) {
            throw new Error("O valor do orçamento deve ser maior que zero")
        }

        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            approval: props.approval ?? false,
        }
    }

    get id() { return this.props.id }
    get value() { return this.props.value }
    get approval() { return this.props.approval }
    get service_id() { return this.props.service_id }
}