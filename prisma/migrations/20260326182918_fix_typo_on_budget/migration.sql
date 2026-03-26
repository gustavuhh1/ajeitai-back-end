/*
  Warnings:

  - You are about to drop the column `aprovoval` on the `budgets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "aprovoval",
ADD COLUMN     "approval" BOOLEAN NOT NULL DEFAULT false;
