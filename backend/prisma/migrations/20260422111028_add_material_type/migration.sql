-- CreateEnum
CREATE TYPE "materialType" AS ENUM ('ALAT', 'BAHAN', 'UPAH');

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "materialType" "materialType" NOT NULL DEFAULT 'BAHAN';
