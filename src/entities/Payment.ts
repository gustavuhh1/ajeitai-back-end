import { randomUUID } from 'node:crypto'

export interface PaymentProps {
    id?: string
    method: string
    amount: number
    status?: 'PENDENTE' | 'PAGO' | 'FALHOU' | 'REEMBOLSADO'
    transaction_id?: string | null
    confirmed_payment?: boolean
    budget_id?: string | null
    client_id: string
    createdAt?: Date
}

export class Payment {
    private props: PaymentProps

    constructor(props: PaymentProps) {
        if (props.amount <= 0) {
            throw new Error("O valor do pagamento deve ser maior que zero")
        }

        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            status: props.status ?? 'PENDENTE',
            confirmed_payment: props.confirmed_payment ?? false,
            transaction_id: props.transaction_id ?? null,
            budget_id: props.budget_id ?? null,
            createdAt: props.createdAt ?? new Date()
        }
    }

    get id() { return this.props.id }
    get method() { return this.props.method }
    get amount() { return this.props.amount }
    get status() { return this.props.status }
    get transaction_id() { return this.props.transaction_id }
    get confirmed_payment() { return this.props.confirmed_payment }
    get budget_id() { return this.props.budget_id }
    get client_id() { return this.props.client_id }
    get createdAt() { return this.props.createdAt }

    // Domain Methods
    public processSuccess(transactionId: string) {
        this.props.status = 'PAGO'
        this.props.confirmed_payment = true
        this.props.transaction_id = transactionId
    }

    public processFailure() {
        this.props.status = 'FALHOU'
        this.props.confirmed_payment = false
    }
}
