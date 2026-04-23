/*
  Warnings:

  - You are about to drop the column `type` on the `AnalysisItem` table. All the data in the column will be lost.
  - Added the required column `type` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaterialItemType" AS ENUM ('MATERIAL', 'LABOR', 'EQUIPMENT');

-- AlterTable
ALTER TABLE "AnalysisItem" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "type" "MaterialItemType" NOT NULL;

-- DropEnum
DROP TYPE "AnalysisItemType";
