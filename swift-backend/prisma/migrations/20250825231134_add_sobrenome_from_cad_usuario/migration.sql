/*
  Warnings:

  - Added the required column `sobrenome` to the `cad_cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."cad_cliente" ADD COLUMN     "sobrenome" TEXT NOT NULL;
