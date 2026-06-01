import { randomUUID } from "node:crypto";

export interface AddressProps {
  rua: string;
  numero: string;
  ponto_de_referencia?: string | null;
  cep: string;
  complemento?: string | null;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  principal?: boolean;
  user_id: string;
}

export class Address {
  private _id: string;
  private props: AddressProps;

  constructor(props: AddressProps, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      principal: props.principal ?? false,
    };
  }

  get id(): string {
    return this._id;
  }

  get rua(): string {
    return this.props.rua;
  }

  set rua(rua: string) {
    this.props.rua = rua;
  }

  get numero(): string {
    return this.props.numero;
  }

  set numero(numero: string) {
    this.props.numero = numero;
  }

  get ponto_de_referencia(): string | null | undefined {
    return this.props.ponto_de_referencia;
  }

  set ponto_de_referencia(ponto_de_referencia: string | null | undefined) {
    this.props.ponto_de_referencia = ponto_de_referencia;
  }

  get cep(): string {
    return this.props.cep;
  }

  set cep(cep: string) {
    this.props.cep = cep;
  }

  get complemento(): string | null | undefined {
    return this.props.complemento;
  }

  set complemento(complemento: string | null | undefined) {
    this.props.complemento = complemento;
  }

  get cidade(): string {
    return this.props.cidade;
  }

  set cidade(cidade: string) {
    this.props.cidade = cidade;
  }

  get estado(): string {
    return this.props.estado;
  }

  set estado(estado: string) {
    this.props.estado = estado;
  }

  get latitude(): number {
    return this.props.latitude;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  get longitude(): number {
    return this.props.longitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  get principal(): boolean {
    return this.props.principal!;
  }

  set principal(principal: boolean) {
    this.props.principal = principal;
  }

  get user_id(): string {
    return this.props.user_id;
  }
}
