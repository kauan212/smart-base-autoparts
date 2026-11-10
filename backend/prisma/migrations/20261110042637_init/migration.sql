-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'COLABORADOR');

-- CreateEnum
CREATE TYPE "StatusArtigo" AS ENUM ('RASCUNHO', 'PUBLICADO', 'ARQUIVADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'COLABORADOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "marca" TEXT,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculos" (
    "id" SERIAL NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoInicio" INTEGER NOT NULL,
    "anoFim" INTEGER,
    "motor" TEXT,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aplicacoes_veiculares" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "veiculoId" INTEGER NOT NULL,

    CONSTRAINT "aplicacoes_veiculares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artigos_conhecimento" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT,
    "conteudo" TEXT NOT NULL,
    "status" "StatusArtigo" NOT NULL DEFAULT 'RASCUNHO',
    "autorId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "produtoId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artigos_conhecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artigos_tags" (
    "artigoId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "artigos_tags_pkey" PRIMARY KEY ("artigoId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigo_key" ON "produtos"("codigo");

-- CreateIndex
CREATE INDEX "produtos_nome_idx" ON "produtos"("nome");

-- CreateIndex
CREATE INDEX "veiculos_fabricante_modelo_idx" ON "veiculos"("fabricante", "modelo");

-- CreateIndex
CREATE UNIQUE INDEX "aplicacoes_veiculares_produtoId_veiculoId_key" ON "aplicacoes_veiculares"("produtoId", "veiculoId");

-- CreateIndex
CREATE INDEX "artigos_conhecimento_titulo_idx" ON "artigos_conhecimento"("titulo");

-- CreateIndex
CREATE INDEX "artigos_conhecimento_categoriaId_idx" ON "artigos_conhecimento"("categoriaId");

-- CreateIndex
CREATE INDEX "artigos_conhecimento_autorId_idx" ON "artigos_conhecimento"("autorId");

-- CreateIndex
CREATE INDEX "artigos_conhecimento_status_idx" ON "artigos_conhecimento"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tags_nome_key" ON "tags"("nome");

-- AddForeignKey
ALTER TABLE "aplicacoes_veiculares" ADD CONSTRAINT "aplicacoes_veiculares_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacoes_veiculares" ADD CONSTRAINT "aplicacoes_veiculares_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigos_conhecimento" ADD CONSTRAINT "artigos_conhecimento_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigos_conhecimento" ADD CONSTRAINT "artigos_conhecimento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigos_conhecimento" ADD CONSTRAINT "artigos_conhecimento_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigos_tags" ADD CONSTRAINT "artigos_tags_artigoId_fkey" FOREIGN KEY ("artigoId") REFERENCES "artigos_conhecimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigos_tags" ADD CONSTRAINT "artigos_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
