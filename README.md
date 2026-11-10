# Smart-Base AutoParts

### Sistema de Gerenciamento e Recuperação de Informações Automotivas

## 1. Sobre o projeto

O Smart-Base AutoParts é um sistema de gerenciamento e recuperação de informações técnicas automotivas. Seu objetivo é organizar conhecimentos relacionados a produtos, componentes, veículos, aplicações e procedimentos de manutenção.

A aplicação possui uma API REST desenvolvida em Node.js e Express, com persistência de dados no PostgreSQL por meio do Prisma ORM. Também conta com uma interface web para consulta e cadastro de artigos técnicos.

O projeto foi desenvolvido como trabalho acadêmico da disciplina de Banco de Dados II.

## 2. Tecnologias utilizadas

- Node.js 22
- Express 5
- PostgreSQL 16
- Prisma ORM 6
- Docker e Docker Compose
- JavaScript
- HTML5 e CSS3
- Git e GitHub

## 3. Arquitetura

O projeto utiliza uma arquitetura organizada em camadas:

- **Rotas:** definem os endpoints disponíveis na API.
- **Controladores:** concentram a lógica de processamento das requisições.
- **Prisma Client:** realiza a comunicação entre a aplicação e o banco de dados.
- **PostgreSQL:** armazena as informações da aplicação.
- **Frontend:** disponibiliza uma interface web para consulta e cadastro de artigos.

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

O diagrama entidade-relacionamento está disponível em `docs/DER.md`.

## 5. Diferencial técnico — Trilha A: Prisma ORM avançado

O projeto utiliza o Prisma ORM como abordagem principal de persistência, contemplando os seguintes recursos:

- Modelagem de entidades e relacionamentos.
- Migrações para controle da estrutura do banco.
- Relacionamentos 1:N e N:N.
- Tabelas associativas explícitas.
- Restrições de unicidade e integridade referencial.
- Índices para otimização de consultas.
- Transações para operações relacionadas.
- Operações `upsert` para criação ou reutilização de tags.
- Consultas relacionais utilizando `include` e `select`.

As transações são utilizadas para executar conjuntamente a consulta paginada e a contagem de registros, além de garantir que o cadastro de artigos e suas respectivas tags sejam processados como uma operação transacional.

O cadastro utiliza operações `upsert` para reutilizar tags existentes ou criar novas, evitando duplicações.

## 6. Estrutura do projeto

```text
smart-base-autoparts/
│
├── backend/
│   ├── controladores/
│   │   ├── artigoController.js
│   │   └── artigoOpcoesController.js
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
│   ├── css/
│   │   ├── cadastro-artigo.css
│   │   └── smartbase.css
│   │
│   ├── js/
│   │   ├── cadastro-artigo.js
│   │   └── smartbase.js
│   │
│   ├── smart-base.html
│   └── cadastro-artigo.html
│
├── docs/
│   └── DER.md
│
├── docker-compose.yml
├── .gitignore
├── IA_LOG.md
└── README.md
```

## 7. Funcionalidades

### 7.1. Consulta de artigos

A interface principal permite:

- Listar artigos técnicos publicados.
- Pesquisar artigos por texto.
- Consultar informações detalhadas.
- Visualizar categorias, autores, produtos e tags.
- Navegar pelos resultados utilizando paginação.

### 7.2. Cadastro de artigos

A interface de cadastro permite:

- Informar título, resumo e conteúdo técnico.
- Selecionar um autor.
- Selecionar uma categoria.
- Vincular um produto, quando necessário.
- Informar tags separadas por vírgulas.
- Cadastrar o artigo diretamente na base de dados.

Os artigos cadastrados são publicados imediatamente. A interface apresenta mensagens de sucesso ou erro e informa o ID do artigo criado.

## 8. Requisitos para execução

- Node.js 22 ou superior.
- npm.
- Docker Desktop.
- Git.

## 9. Instalação e configuração

### 9.1. Clonar o repositório

```bash
git clone https://github.com/kauan212/smart-base-autoparts.git
```

Acessar a pasta:

```bash
cd smart-base-autoparts
```

### 9.2. Iniciar o PostgreSQL

Na pasta principal:

```bash
docker compose up -d
```

O Docker Compose inicia um container PostgreSQL 16 e utiliza um volume persistente para armazenar os dados.

### 9.3. Configurar o backend

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

### 9.4. Aplicar as migrações

Com o PostgreSQL em execução e a variável de ambiente configurada:

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrações existentes no projeto.

### 9.5. Popular o banco de dados

Executar:

```bash
node seed.js
```

O script realiza a inserção de dados fictícios para utilização e testes da aplicação.

### 9.6. Inicializar a aplicação

Na pasta `backend`, executar:

```bash
npm run dev
```

Ou:

```bash
npm start
```

A API e a interface web estarão disponíveis por meio do servidor local.

## 10. Acesso à aplicação

Com o servidor em execução, utilizar os seguintes endereços:

| Recurso | Endereço |
|---|---|
| Página inicial | `http://localhost:3000/smart-base.html` |
| Cadastro de artigos | `http://localhost:3000/cadastro-artigo.html` |
| API de artigos | `http://localhost:3000/api/artigos` |
| Opções para cadastro | `http://localhost:3000/api/artigos/opcoes` |

## 11. Endpoints da API

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
GET /api/artigos?busca=Filtro%20de%20oleo
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

### Consultar opções de cadastro

**GET** `/api/artigos/opcoes`

Retorna os autores, categorias e produtos disponíveis para preenchimento do formulário de cadastro.

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

Em caso de sucesso, a API retorna HTTP 201 e os dados do artigo cadastrado.

## 12. Dados fictícios

O script de população inicial contempla:

| Registro | Quantidade inicial |
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

## 13. Verificação do banco de dados

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

## 14. Controle de versão

O projeto utiliza Git para controle de versão e GitHub para armazenamento remoto do código-fonte.

Repositório:

https://github.com/kauan212/smart-base-autoparts

## 15. Registro de utilização de inteligência artificial

O arquivo `IA_LOG.md` apresenta o registro da utilização de ferramentas de inteligência artificial durante o desenvolvimento, incluindo apoio no planejamento, implementação, documentação e testes.

## 16. Considerações finais

O Smart-Base AutoParts demonstra a aplicação de conceitos de modelagem relacional, integridade referencial, persistência de dados, arquitetura de APIs REST e utilização avançada do Prisma ORM.

A solução foi desenvolvida com foco na organização e recuperação de informações técnicas automotivas, permitindo consultas, filtros, paginação e cadastro de artigos relacionados a produtos, categorias, autores e tags.

O projeto integra banco de dados relacional, operações transacionais, relacionamentos entre entidades e uma interface web para facilitar a utilização da base de conhecimento.
