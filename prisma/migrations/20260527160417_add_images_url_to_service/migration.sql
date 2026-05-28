-- AlterTable
ALTER TABLE "services" ADD COLUMN     "images_url" TEXT[] DEFAULT ARRAY[]::TEXT[];
