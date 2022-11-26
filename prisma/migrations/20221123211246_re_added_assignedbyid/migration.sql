/*
  Warnings:

  - Added the required column `assignedById` to the `CategoriesQuestionsRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoriesQuestionsRelation" ADD COLUMN     "assignedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CategoriesQuestionsRelation" ADD CONSTRAINT "CategoriesQuestionsRelation_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
