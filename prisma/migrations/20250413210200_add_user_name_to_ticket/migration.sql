/*
  Warnings:

  - Added the required column `userName` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "userName" TEXT NOT NULL;
