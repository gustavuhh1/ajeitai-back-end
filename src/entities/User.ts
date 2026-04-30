import { randomUUID } from "node:crypto"

export interface UserProps {
    id?: string
    name: string
    email: string
    password?: string | null
    cpf: string
    role?: 'CLIENT' | 'PROVIDER' | 'ADMIN'
    created_at?: Date
}

export class User {
    private props: UserProps

    constructor(props: UserProps) {
        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            role: props.role ?? 'CLIENT',
            created_at: props.created_at ?? new Date()
        }
    }

    get id() { return this.props.id}
    get name() { return this.props.name}
    get email() { return this.props.email}
    get password() { return this.props.password}
    get cpf() {return this.props.cpf}
    get role() { return this.props.role}
}