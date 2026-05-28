import { randomUUID } from "node:crypto";

export interface BudgetProps {
  id?: string;
  serviceId: string;
  providerId: string;
  price: number;
  description: string;
  estimatedDate: Date;
  status?: "AGUARDANDO_CLIENTE" | "AGUARDANDO_PRESTADOR" | "ACEITO" | "PAGO" | "RECUSADO";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Budget {
  private props: BudgetProps;

  constructor(props: BudgetProps) {
    if (props.price <= 0) {
      throw new Error("O preço da proposta deve ser maior que zero");
    }

    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
      status: props.status ?? "AGUARDANDO_CLIENTE",
    };
  }

  get id() {
    return this.props.id;
  }
  get serviceId() {
    return this.props.serviceId;
  }
  get providerId() {
    return this.props.providerId;
  }
  get price() {
    return this.props.price;
  }
  get description() {
    return this.props.description;
  }
  get estimatedDate() {
    return this.props.estimatedDate;
  }
  get status() {
    return this.props.status;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  public fazerCotraProposta(
    newPrice: number,
    newDate: Date,
    newDescription: string,
    isFromClient: boolean,
  ) {
    if (newPrice <= 0) throw new Error("O preço da proposta deve ser maior que zero");

    this.props.price = newPrice;
    this.props.estimatedDate = newDate;
    this.props.description = newDescription;
    this.props.status = isFromClient ? "AGUARDANDO_PRESTADOR" : "AGUARDANDO_CLIENTE";
    this.props.updatedAt = new Date();
    //mantem createdAt e atualiza apenas updatedAt
  }

  public accept() {
    this.props.status = "ACEITO";
    this.props.updatedAt = new Date();
  }

  public reject() {
    this.props.status = "RECUSADO";
    this.props.updatedAt = new Date();
  }
}
