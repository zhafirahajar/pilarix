/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `AnalysisItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "totalPrice";

-- AlterTable
ALTER TABLE "AnalysisItem" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "ProjectMaterialPrice" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProjectMaterialPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMaterialPrice_projectId_materialId_key" ON "ProjectMaterialPrice"("projectId", "materialId");

-- AddForeignKey
ALTER TABLE "ProjectMaterialPrice" ADD CONSTRAINT "ProjectMaterialPrice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMaterialPrice" ADD CONSTRAINT "ProjectMaterialPrice_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
