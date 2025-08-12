/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `cad_usuario` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `nivel_acesso` on the `cad_usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."nivel_acesso" AS ENUM ('ADMIN', 'GERENTE', 'OPERADOR');

-- AlterTable
ALTER TABLE "public"."cad_usuario" DROP COLUMN "nivel_acesso",
ADD COLUMN     "nivel_acesso" "public"."nivel_acesso" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cad_usuario_email_key" ON "public"."cad_usuario"("email");
