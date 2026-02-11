/*
  Warnings:

  - You are about to drop the column `allowPartialPayments` on the `merchants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "allowPartialPayments";
