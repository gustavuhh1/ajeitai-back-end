/*
  Warnings:

  - You are about to drop the column `ponto_de_referencia` on the `adresses` table. All the data in the column will be lost.
  - Added the required column `apelido` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bairro` to the `adresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adresses" DROP COLUMN "ponto_de_referencia",
ADD COLUMN     "apelido" TEXT NOT NULL,
ADD COLUMN     "bairro" TEXT NOT NULL;
