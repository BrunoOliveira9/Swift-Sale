-- CreateTable
CREATE TABLE "public"."cad_cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT,

    CONSTRAINT "cad_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cad_venda" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_cliente" INTEGER,
    "total" DECIMAL(10,2) NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cad_venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_venda" (
    "id" SERIAL NOT NULL,
    "id_venda" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unit" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_venda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cad_cliente_cpf_key" ON "public"."cad_cliente"("cpf");

-- AddForeignKey
ALTER TABLE "public"."cad_venda" ADD CONSTRAINT "cad_venda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."cad_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cad_venda" ADD CONSTRAINT "cad_venda_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."cad_cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_venda" ADD CONSTRAINT "item_venda_id_venda_fkey" FOREIGN KEY ("id_venda") REFERENCES "public"."cad_venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_venda" ADD CONSTRAINT "item_venda_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "public"."cad_produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
