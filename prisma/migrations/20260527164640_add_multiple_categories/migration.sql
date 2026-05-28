/*
  Warnings:

  - You are about to drop the column `category_id` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_category_id_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "category_id";

-- CreateTable
CREATE TABLE "_CategoryToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToService_B_index" ON "_CategoryToService"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToService" ADD CONSTRAINT "_CategoryToService_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToService" ADD CONSTRAINT "_CategoryToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
