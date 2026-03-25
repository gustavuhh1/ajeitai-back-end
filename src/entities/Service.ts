import {randomUUID} from 'node:crypto'

export interface ServiceProps {
    id?: string
    title: string
    description: string
    status?: 'UNDER_ANALYSIS' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
    category_id: string
    client_id: string
    provider_id?: string | null
    start_date?: Date | null
    end_date?: Date | null

    latitude?: number | null
    longitude?: number | null
    city: string
    neighborhood?: string | null
}

export class Service {
    private props: ServiceProps

    constructor(props: ServiceProps) {
        if(!props.title) {
            throw new Error("O título do serviço é obrigatório")
        }

        if(!props.city) {
            throw new Error("A cidade do serviço é obrigatória para localização")
        }

        this.props = {
            ...props,
            id: props.id ?? randomUUID(),
            status: props.status ?? 'UNDER_ANALYSIS',
            provider_id: props.provider_id ?? null,
            start_date: props.start_date ?? null,
            end_date: props.end_date ?? null,
            latitude: props.latitude ?? null,
            longitude: props.longitude ?? null,
            neighborhood: props.neighborhood ?? null
        }
    }

    get id() { return this.props.id}
    get title() { return this.props.title}
    get description() { return this.props.description}
    get status() { return this.props.status}
    get category_id() {return this.props.category_id}
    get client_id() { return this.props.client_id}
    get provider_id() { return this.props.provider_id}

    get start_date() { return this.props.start_date }
    get end_date() { return this.props.end_date }

    get latitude() { return this.props.latitude }
    get longitude() { return this.props.longitude }
    get city() { return this.props.city }
    get neighborhood() { return this.props.neighborhood }
}