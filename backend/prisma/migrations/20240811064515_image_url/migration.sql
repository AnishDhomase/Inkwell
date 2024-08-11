/*
  Warnings:

  - You are about to drop the column `profilePic` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "profilePic",
ADD COLUMN     "profilePicURL" TEXT;
