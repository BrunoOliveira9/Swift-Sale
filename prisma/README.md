# Configuração e Uso do Prisma no Projeto

Este documento explica como configurar o Prisma, criar o banco de dados e popular dados para teste no projeto.

---

## Antes de tudo rode o banco postgres na sua máquina:

```bash
docker run -d --name db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=494a1e7cc6580effaf6c7b4fb6451b7c -e POSTGRES_DB=postgres -p 5432:5432 postgres:17
```

## 1. Instalação

Se ainda não instalou as dependências do Prisma, execute:

```bash
npm install @prisma/client prisma --save-dev
```

## 2. Configurar o Banco de Dados

No arquivo .env na raiz do projeto, defina a variável DATABASE_URL com a string de conexão do seu banco PostgreSQL. Exemplo:

```bash
DATABASE_URL="postgresql://postgres:494a1e7cc6580effaf6c7b4fb6451b7c@localhost:5432/swift_sale?schema=public"
```

## 3. Criar o Banco com Prisma

Com o schema definido no arquivo prisma/schema.prisma, execute para criar as migrations e subir o banco:

```bash
npx prisma migrate dev --name init
```

## 4. Gerar Prisma Client

Para atualizar o client Prisma sempre que o schema for modificado:

```bash
npx prisma generate
```
## 5. Popular Dados de Teste

Para popular dados de teste, você pode criar um script simples usando o Prisma Client.

```bash
npx ts-node prisma/seed.ts
```

## 7. Ferramenta útil

```bash
npx prisma studio
```