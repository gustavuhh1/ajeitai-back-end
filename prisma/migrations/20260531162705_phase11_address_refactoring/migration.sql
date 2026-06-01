/*
  Warnings:

  - You are about to drop the column `number` on the `adresses` table. All the data in the column will be lost.
  - You are about to drop the column `reference_point` on the `adresses` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `adresses` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `adresses` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `services` table. All the data in the column will be lost.
  - Added the required column `cidade` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `adresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adresses" DROP COLUMN "number",
DROP COLUMN "reference_point",
DROP COLUMN "street",
DROP COLUMN "type",
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "ponto_de_referencia" TEXT,
ADD COLUMN     "principal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rua" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "city",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "neighborhood",
ADD COLUMN     "address_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
