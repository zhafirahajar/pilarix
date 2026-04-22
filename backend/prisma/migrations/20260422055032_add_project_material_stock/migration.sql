/*
  Warnings:

  - Added the required column `projectId` to the `MaterialTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MaterialTransaction" DROP CONSTRAINT "MaterialTransaction_pekerjaanId_fkey";

-- AlterTable
ALTER TABLE "MaterialTransaction" ADD COLUMN     "projectId" INTEGER NOT NULL,
ALTER COLUMN "pekerjaanId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProjectMaterialStock" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectMaterialStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMaterialStock_projectId_materialId_key" ON "ProjectMaterialStock"("projectId", "materialId");

-- AddForeignKey
ALTER TABLE "ProjectMaterialStock" ADD CONSTRAINT "ProjectMaterialStock_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMaterialStock" ADD CONSTRAINT "ProjectMaterialStock_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialTransaction" ADD CONSTRAINT "MaterialTransaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialTransaction" ADD CONSTRAINT "MaterialTransaction_pekerjaanId_fkey" FOREIGN KEY ("pekerjaanId") REFERENCES "Pekerjaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
