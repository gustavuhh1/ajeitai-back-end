import { randomUUID } from "node:crypto";

export interface AddressProps {
  apelido: string;
  rua: string;
  numero: string;
  cep: string;
  complemento?: string | null;
  cidade: string;
  estado: string;
  bairro: string;
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

  get apelido(): string {
    return this.props.apelido;
  }

  set apelido(apelido: string) {
    this.props.apelido = apelido;
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

  get bairro(): string {
    return this.props.bairro;
  }

  set bairro(bairro: string) {
    this.props.bairro = bairro;
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

  toJSON() {
    return {
      id: this.id,
      apelido: this.apelido,
      rua: this.rua,
      numero: this.numero,
      cep: this.cep,
      complemento: this.complemento,
      cidade: this.cidade,
      estado: this.estado,
      bairro: this.bairro,
      latitude: this.latitude,
      longitude: this.longitude,
      principal: this.principal,
      user_id: this.user_id,
    };
  }
}
