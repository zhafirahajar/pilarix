/*
  Warnings:

  - You are about to drop the column `purchaseId` on the `MaterialTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `coefficient` on the `MaterialUsage` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `MaterialUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MaterialTransaction" DROP CONSTRAINT "MaterialTransaction_purchaseId_fkey";

-- AlterTable
ALTER TABLE "MaterialTransaction" DROP COLUMN "purchaseId",
ADD COLUMN     "purchaseItemId" INTEGER;

-- AlterTable
ALTER TABLE "MaterialUsage" DROP COLUMN "coefficient",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- DropEnum
DROP TYPE "materialType";

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION,
    "pekerjaanId" INTEGER,
    "rabItemId" INTEGER,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_pekerjaanId_fkey" FOREIGN KEY ("pekerjaanId") REFERENCES "Pekerjaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_rabItemId_fkey" FOREIGN KEY ("rabItemId") REFERENCES "RabItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialTransaction" ADD CONSTRAINT "MaterialTransaction_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES "PurchaseItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
