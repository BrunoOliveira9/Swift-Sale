/*
  Warnings:

  - Added the required column `atualizado_em` to the `cad_usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargo` to the `cad_usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel_acesso` to the `cad_usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `cad_usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."cad_usuario" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "nivel_acesso" INTEGER NOT NULL,
ADD COLUMN     "sobrenome" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT;
