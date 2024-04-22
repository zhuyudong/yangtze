/*
  Warnings:

  - You are about to drop the column `favorits` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `favorited` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `favorited_by` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `liked` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `liked_by` on the `movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "content" DROP COLUMN "favorits",
ADD COLUMN     "favorites" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "movie" DROP COLUMN "favorited",
DROP COLUMN "favorited_by",
DROP COLUMN "liked",
DROP COLUMN "liked_by",
ADD COLUMN     "favorites" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
