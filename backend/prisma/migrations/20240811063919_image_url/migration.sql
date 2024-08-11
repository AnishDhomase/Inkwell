/*
  Warnings:

  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blogImageURL" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePic",
ADD COLUMN     "profilePicURL" TEXT;
