import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

export interface UserProps {
  id?: string;
  avatar_url?: string | null;
  name: string;
  email: string;
  password?: string | null;
  cpf: string;
  phone?: string | null;
  age?: number | null;
  description?: string | null;
  role?: "CLIENT" | "PROVIDER" | "ADMIN";
  avgRating?: Prisma.Decimal;
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
      avatar_url: props.avatar_url ?? null,
      phone: props.phone ?? null,
      age: props.age ?? null,
      description: props.description ?? null,
      role: props.role ?? "CLIENT",
      avgRating: props.avgRating ?? new Prisma.Decimal(0),
      created_at: props.created_at ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }
  get avatar_url() {
    return this.props.avatar_url;
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
  get age() {
    return this.props.age;
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
}
