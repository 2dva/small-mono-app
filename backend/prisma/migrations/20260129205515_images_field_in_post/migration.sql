/*
  Warnings:

  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN "images" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostImage";
PRAGMA foreign_keys=on;
