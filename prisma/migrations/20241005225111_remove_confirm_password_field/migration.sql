/*
  Warnings:

  - You are about to drop the column `confirm_password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "confirm_password";
