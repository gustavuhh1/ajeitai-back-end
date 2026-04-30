import { Prisma } from "@prisma/client"
import { randomUUID } from "node:crypto"

export interface UserProps {
    id?: string
    name: string
    email: string
    password?: string | null
    cpf: string
    role?: 'CLIENT' | 'PROVIDER' | 'ADMIN'
    avgRating?: Prisma.Decimal
    created_at?: Date
}

export class User {
    private props: UserProps

    constructor(props: UserProps) {
        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            role: props.role ?? 'CLIENT',
            avgRating: props.avgRating ?? new Prisma.Decimal(0),
            created_at: props.created_at ?? new Date()
        }
    }

    get id() { return this.props.id}
    get avgRating() { return this.props.avgRating ?? new Prisma.Decimal(0)}
    get name() { return this.props.name}
    get email() { return this.props.email}
    get password() { return this.props.password}
    get cpf() {return this.props.cpf}
    get role() { return this.props.role}
}