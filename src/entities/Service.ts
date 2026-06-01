import { randomUUID } from "node:crypto";

export interface ServiceProps {
  id?: string;
  title: string;
  images_url?: string[] | null;
  description: string;
  status?:
    | "ABERTO"
    | "AGUARDANDO_PAGAMENTO"
    | "APROVADO"
    | "EM_ANDAMENTO"
    | "FINALIZADO"
    | "CANCELADO";
  categoryIds: string[];
  client_id: string;
  provider_id?: string | null;
  start_date?: Date | null; // Prestador deu inicio ao servico 
  end_date?: Date | null; // Prestador finalizou o servico

  createdAt?: Date;
  updatedAt?: Date;

  address_id: string;
}

export class Service {
  private props: ServiceProps;

  constructor(props: ServiceProps) {
    if (!props.title) {
      throw new Error("O título do serviço é obrigatório");
    }

    if (!props.address_id) {
      throw new Error("O ID do endereço é obrigatório");
    }

    if (!props.categoryIds || props.categoryIds.length === 0) {
      throw new Error("O serviço precisa ter pelo menos uma categoria");
    }

    if (props.categoryIds.length > 3) {
      throw new Error("O serviço pode ter no máximo 3 categorias");
    }

    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
      status: props.status ?? "ABERTO",
      images_url: props.images_url ?? null,
      provider_id: props.provider_id ?? null,
      start_date: props.start_date ?? null,
      end_date: props.end_date ?? null,
      address_id: props.address_id,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
  get images_url() {
    return this.props.images_url;
  }
  get description() {
    return this.props.description;
  }
  get status() {
    return this.props.status;
  }
  get categoryIds() {
    return this.props.categoryIds;
  }
  get client_id() {
    return this.props.client_id;
  }
  get provider_id() {
    return this.props.provider_id;
  }

  get start_date() {
    return this.props.start_date;
  }
  get end_date() {
    return this.props.end_date;
  }

  get address_id() {
    return this.props.address_id;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  // Domain Methods
  public aceitarOrcamento(providerId: string) {
    this.props.provider_id = providerId;
    this.props.status = "AGUARDANDO_PAGAMENTO";
  }

  public confirmarPagamento() {
    this.props.status = "APROVADO";
  }

  public iniciarServico() {
    if (this.props.status !== "APROVADO")
      throw new Error("Serviço precisa estar aprovado para iniciar");
    this.props.status = "EM_ANDAMENTO";
  }

  public finalizarServico() {
    if (this.props.status !== "EM_ANDAMENTO")
      throw new Error("Serviço precisa estar em andamento para ser finalizado");
    this.props.status = "FINALIZADO";
  }

  public cancelar() {
    this.props.status = "CANCELADO";
  }
}
