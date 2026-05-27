import { randomUUID } from 'node:crypto'

export interface MessageProps {
    id?: string
    text?: string | null
    imageUrl?: string | null
    senderId: string
    budgetId: string
    createdAt?: Date
}

export class Message {
    private props: MessageProps

    constructor(props: MessageProps) {
        if (!props.text && !props.imageUrl) {
            throw new Error("A mensagem deve conter texto ou uma imagem")
        }

        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            createdAt: props.createdAt ?? new Date()
        }
    }

    get id() { return this.props.id }
    get text() { return this.props.text }
    get imageUrl() { return this.props.imageUrl }
    get senderId() { return this.props.senderId }
    get budgetId() { return this.props.budgetId }
    get createdAt() { return this.props.createdAt }


}
