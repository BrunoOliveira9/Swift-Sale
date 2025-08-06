-- CreateEnum
CREATE TYPE "public"."unidade_medida" AS ENUM ('UNIDADE', 'KG', 'LITRO', 'METRO', 'CAIXA', 'PACOTE', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."tipo_movimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "public"."cad_produto" (
    "id" SERIAL NOT NULL,
    "codigo_barras" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT NOT NULL,
    "unidade_medida" "public"."unidade_medida" NOT NULL,
    "preco_venda" DECIMAL(10,2) NOT NULL,
    "preco_custo" DECIMAL(10,2) NOT NULL,
    "estoque_atual" INTEGER NOT NULL DEFAULT 0,
    "estoque_minimo" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cad_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movimentacao_estoque" (
    "id" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "tipo" "public"."tipo_movimentacao" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacao_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cad_usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "cad_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cad_produto_codigo_barras_key" ON "public"."cad_produto"("codigo_barras");

-- CreateIndex
CREATE UNIQUE INDEX "cad_usuario_username_key" ON "public"."cad_usuario"("username");

-- AddForeignKey
ALTER TABLE "public"."movimentacao_estoque" ADD CONSTRAINT "movimentacao_estoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "public"."cad_produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
