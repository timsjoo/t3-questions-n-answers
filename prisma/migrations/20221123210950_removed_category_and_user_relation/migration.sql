/*
  Warnings:

  - You are about to drop the column `assignedById` on the `CategoriesQuestionsRelation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesQuestionsRelation" DROP CONSTRAINT "CategoriesQuestionsRelation_assignedById_fkey";

-- AlterTable
ALTER TABLE "CategoriesQuestionsRelation" DROP COLUMN "assignedById";
