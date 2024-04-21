/*
  Warnings:

  - You are about to drop the column `favorited_by` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `liked_by` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_planId_fkey";

-- AlterTable
ALTER TABLE "content" DROP COLUMN "favorited_by",
DROP COLUMN "liked_by";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "planId",
ADD COLUMN     "liked_ids" TEXT[],
ADD COLUMN     "no_interest_ids" TEXT[],
ADD COLUMN     "plan_id" INTEGER;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
