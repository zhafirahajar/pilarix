/*
  Warnings:

  - You are about to drop the column `quantity` on the `MaterialUsage` table. All the data in the column will be lost.
  - Added the required column `coefficient` to the `MaterialUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MaterialUsage" DROP COLUMN "quantity",
ADD COLUMN     "analysisId" INTEGER,
ADD COLUMN     "coefficient" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "MaterialUsage" ADD CONSTRAINT "MaterialUsage_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
