import {randomUUID} from 'node:crypto'

export interface ServiceProps {
    id?: string
    title: string
    // TODO: colocar fotos[] como tipo
    description: string
    status?: 'ABERTO' | 'AGUARDANDO_PAGAMENTO' | 'APROVADO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO'
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
            status: props.status ?? 'ABERTO',
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

    // Domain Methods
    public aceitarOrcamento(providerId: string) {
        this.props.provider_id = providerId;
        this.props.status = 'AGUARDANDO_PAGAMENTO';
    }

    public confirmarPagamento() {
        this.props.status = 'APROVADO';
    }

    public iniciarServico() {
        if (this.props.status !== 'APROVADO') throw new Error("Serviço precisa estar aprovado para iniciar");
        this.props.status = 'EM_ANDAMENTO';
    }

    public finalizarServico() {
        if (this.props.status !== 'EM_ANDAMENTO') throw new Error("Serviço precisa estar em andamento para ser finalizado");
        this.props.status = 'FINALIZADO';
    }

    public cancelar() {
        this.props.status = 'CANCELADO';
    }
}