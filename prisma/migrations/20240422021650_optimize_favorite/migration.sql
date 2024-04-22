/*
  Warnings:

  - You are about to drop the column `favorited` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `liked` on the `content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "content" DROP COLUMN "favorited",
DROP COLUMN "liked",
ADD COLUMN     "favorits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weekly" INTEGER;
