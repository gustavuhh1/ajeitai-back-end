import { AbacatePay } from "@abacatepay/sdk";

if (!process.env.ABACATE_PAY_SECRET) {
  throw new Error("ABACATE_PAY_SECRET não configurado no .env");
}

export const abacatePay = new AbacatePay(process.env.ABACATE_PAY_SECRET);
