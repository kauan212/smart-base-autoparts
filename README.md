# Smart-Base AutoParts

### Sistema de Gerenciamento e Recuperação de Informações Automotivas

## 1. Sobre o projeto

O Smart-Base AutoParts é um sistema de gerenciamento e recuperação de informações técnicas automotivas. Seu objetivo é organizar conhecimentos relacionados a produtos, componentes, veículos, aplicações e procedimentos de manutenção.

A aplicação utiliza uma API REST desenvolvida em Node.js e Express, com persistência de dados no PostgreSQL por meio do Prisma ORM.

O projeto foi desenvolvido como trabalho acadêmico da disciplina de Banco de Dados II.

## 2. Tecnologias utilizadas

- Node.js 22
- Express 5
- PostgreSQL 16
- Prisma ORM 6
- Docker e Docker Compose
- JavaScript
- Git e GitHub

## 3. Arquitetura

O projeto utiliza uma arquitetura organizada em camadas:

- **Rotas:** definem os endpoints disponíveis.
- **Controladores:** concentram a lógica de processamento das requisições.
- **Prisma Client:** realiza a comunicação com o banco de dados.
- **PostgreSQL:** armazena as informações da aplicação.

## 4. Modelagem do banco de dados

O banco de dados possui oito entidades principais:

| Entidade | Descrição |
|---|---|
| Usuario | Armazena os usuários do sistema. |
| Categoria | Organiza os artigos por assunto. |
| Produto | Armazena informações dos produtos automotivos. |
| Veiculo | Armazena fabricantes, modelos e características dos veículos. |
| AplicacaoVeicular | Relaciona produtos e veículos compatíveis. |
| ArtigoConhecimento | Armazena artigos e informações técnicas. |
| Tag | Armazena palavras-chave para classificação. |
| ArtigoTag | Relaciona artigos e tags. |

### Relacionamentos

- Um usuário pode cadastrar vários artigos.
- Uma categoria pode possuir vários artigos.
- Um produto pode estar relacionado a vários artigos.
- Um produto pode possuir aplicações em vários veículos.
- Um veículo pode estar relacionado a vários produtos.
- Um artigo pode possuir várias tags.
- Uma tag pode estar associada a vários artigos.

A modelagem utiliza chaves primárias, chaves estrangeiras, restrições de unicidade, índices e relacionamentos explícitos.

## 5. Diferencial técnico — Prisma ORM

O projeto utiliza o Prisma ORM como abordagem principal de persistência, contemplando recursos avançados:

- Modelagem de entidades e relacionamentos.
- Migrações para controle da estrutura do banco.
- Relacionamentos 1:N e N:N.
- Tabelas associativas explícitas.
- Restrições de unicidade e integridade referencial.
- Índices para otimização de consultas.
- Transações para operações relacionadas.
- Operações `upsert` para criação ou reutilização de tags.

As transações são utilizadas tanto na consulta paginada quanto no cadastro de artigos e suas respectivas tags.

## 6. Estrutura do projeto

```text
smart-base-autoparts/
│
├── backend/
│   ├── controladores/
│   │   └── artigoController.js
│   │
│   ├── rotas/
│   │   └── artigoRotas.js
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── dados/
│   ├── middlewares/
│   ├── .env.example
│   ├── package.json
│   ├── prisma.config.ts
│   ├── prismaClient.js
│   ├── seed.js
│   ├── servidor.js
│   └── verificar-banco.js
│
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 7. Requisitos para execução

- Node.js 22 ou superior.
- npm.
- Docker Desktop.
- Git.

## 8. Instalação e configuração

### 8.1. Clonar o repositório

```bash
git clone https://github.com/kauan212/smart-base-autoparts.git
```

Acessar a pasta:

```bash
cd smart-base-autoparts
```

### 8.2. Iniciar o PostgreSQL

Na pasta principal:

```bash
docker compose up -d
```

O Docker Compose inicia um container PostgreSQL 16 e utiliza um volume persistente para armazenar os dados.

### 8.3. Configurar o backend

Entrar na pasta:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

Criar o arquivo `.env` a partir do modelo `.env.example`.

Configurar a variável `DATABASE_URL` com os dados de conexão do PostgreSQL.

Exemplo:

```env
DATABASE_URL="postgresql://smartbase:smartbase123@localhost:5432/smartbase?schema=public"
```

Não publicar o arquivo `.env` no GitHub.

### 8.4. Aplicar as migrações

Com o PostgreSQL em execução e a variável de ambiente configurada:

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrações existentes no projeto.

### 8.5. Popular o banco de dados

Executar:

```bash
node seed.js
```

O script realiza a inserção de dados fictícios para utilização e testes da aplicação.

## 9. Inicialização da API

Na pasta `backend`, executar:

```bash
npm run dev
```

Ou iniciar em modo de execução:

```bash
npm start
```

A API estará disponível em:

```text
http://localhost:3000
```

Endpoint principal:

```text
http://localhost:3000/api/artigos
```

## 10. Endpoints da API

### Listar artigos

**GET** `/api/artigos`

Retorna artigos publicados com informações relacionadas de categoria, autor, produto e tags.

Parâmetros opcionais:

| Parâmetro | Descrição |
|---|---|
| busca | Pesquisa por título, resumo ou conteúdo. |
| categoriaId | Filtra por categoria. |
| produtoId | Filtra por produto. |
| pagina | Define a página de resultados. |
| limite | Define a quantidade de resultados. |

Exemplo:

```text
GET /api/artigos?pagina=1&limite=5
```

### Pesquisar artigos

```text
GET /api/artigos?busca=Filtro%20de%20ar
```

### Filtrar por categoria

```text
GET /api/artigos?categoriaId=1&limite=5
```

### Filtrar por produto

```text
GET /api/artigos?produtoId=1&limite=5
```

### Buscar artigo por ID

**GET** `/api/artigos/:id`

Exemplo:

```text
GET /api/artigos/2
```

Retorna os dados do artigo e seus relacionamentos.

Caso o artigo não seja encontrado ou não esteja publicado, a API retorna HTTP 404.

### Cadastrar artigo

**POST** `/api/artigos`

Exemplo de corpo JSON:

```json
{
  "titulo": "Manutenção do filtro de óleo",
  "resumo": "Informações sobre manutenção preventiva.",
  "conteudo": "Descrição técnica do procedimento de manutenção.",
  "autorId": 1,
  "categoriaId": 1,
  "produtoId": 1,
  "tags": [
    "Manutenção",
    "Prevenção",
    "Motor"
  ]
}
```

O cadastro utiliza transação para registrar o artigo e suas tags.

As tags existentes são reutilizadas e as novas são cadastradas automaticamente.

## 11. Dados fictícios

O script de população inicial contempla:

| Registro | Quantidade |
|---|---:|
| Usuários | 5 |
| Categorias | 10 |
| Produtos | 30 |
| Veículos | 15 |
| Aplicações veiculares | 60 |
| Tags | 20 |
| Artigos técnicos | 1.000 |
| Relacionamentos entre artigos e tags | 3.000 |

Os dados são fictícios e destinados à utilização acadêmica e à validação das funcionalidades.

## 12. Verificação do banco de dados

Para conferir a quantidade de registros armazenados, executar na pasta `backend`:

```bash
node verificar-banco.js
```

Para validar o schema:

```bash
npx prisma validate
```

Para verificar o estado das migrações:

```bash
npx prisma migrate status
```

## 13. Controle de versão

O projeto utiliza Git para controle de versão e GitHub para armazenamento remoto do código-fonte.

Repositório:

https://github.com/kauan212/smart-base-autoparts

## 14. Considerações finais

O Smart-Base AutoParts demonstra a aplicação de conceitos de modelagem relacional, integridade referencial, persistência de dados, arquitetura de APIs REST e utilização avançada do Prisma ORM.

A solução foi desenvolvida com foco na organização e recuperação de informações técnicas automotivas, permitindo consultas, filtros, paginação e cadastro de artigos relacionados a produtos, categorias, autores e tags.