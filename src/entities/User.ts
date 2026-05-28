import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

export interface UserProps {
  id?: string;
  image?: string | null;
  name: string;
  email: string;
  password?: string | null;
  cpf: string;
  phone?: string | null;
  birthDate?: Date | null;
  description?: string | null;
  role?: "CLIENT" | "PROVIDER" | "ADMIN";
  avgRating?: Prisma.Decimal;
  pixKey?: string | null;
  created_at?: Date;
}

export enum UserRoles {
  CLIENT = "CLIENT",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
      image: props.image ?? null,
      phone: props.phone ?? null,
      birthDate: props.birthDate ?? null,
      description: props.description ?? null,
      role: props.role ?? "CLIENT",
      avgRating: props.avgRating ?? new Prisma.Decimal(0),
      pixKey: props.pixKey ?? null,
      created_at: props.created_at ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }
  get image() {
    return this.props.image;
  }
  get avgRating() {
    return this.props.avgRating ?? new Prisma.Decimal(0);
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  get cpf() {
    return this.props.cpf;
  }
  get phone() {
    return this.props.phone;
  }
  get birthDate() {
    return this.props.birthDate;
  }
  get description() {
    return this.props.description;
  }
  get role() {
    return this.props.role;
  }

  set avgRating(value: Prisma.Decimal) {
    this.props.avgRating = value;
  }
  
  get pixKey() {
    return this.props.pixKey;
  }
  
  set pixKey(value: string | null | undefined) {
    this.props.pixKey = value;
  }
}

