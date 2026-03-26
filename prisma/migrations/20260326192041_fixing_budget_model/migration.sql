/*
  Warnings:

  - You are about to drop the column `approval` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `budgets` table. All the data in the column will be lost.
  - Added the required column `description` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedDate` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `budgets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_service_id_fkey";

-- DropIndex
DROP INDEX "budgets_service_id_key";

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "approval",
DROP COLUMN "service_id",
DROP COLUMN "value",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "estimatedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL,
ADD COLUMN     "status" "BudgetStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
