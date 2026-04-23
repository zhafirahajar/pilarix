/*
  Warnings:

  - Made the column `totalPrice` on table `Analysis` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "totalPrice" SET NOT NULL;
