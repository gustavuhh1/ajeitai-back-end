# Ajeita - Backend

Backend do **Ajeita**, uma plataforma digital que conecta clientes a prestadores de serviço, permitindo cadastro, busca, agendamento, orçamentos, pagamentos e avaliações.

Este repositório expõe uma **API REST** que será consumida pelo front-end em Next.js.

---

## Tecnologias principais

- **Node.js** – runtime JavaScript/TypeScript para o servidor.
- **Express** – framework minimalista para criação da API HTTP.
- **Better Auth** – autenticação e gerenciamento de sessão/token.
- **Prisma ORM** – ORM para modelagem e acesso ao banco de dados.
- **PostgreSQL** – banco de dados relacional principal da aplicação.
- **Zod** – validação e tipagem de esquemas (inputs/DTOs) no back-end.

---

## Objetivo do projeto

O objetivo deste backend é fornecer uma API consistente e segura para suportar as jornadas principais do Ajeita:

- Cliente:
  - Cadastro, login e recuperação de senha
  - Busca de serviços e prestadores
  - Solicitação, comparação e aprovação de orçamentos
  - Agendamento, pagamento e avaliação do prestador

- Prestador:
  - Cadastro, login e recuperação de senha
  - Cadastro e gestão de serviços
  - Gestão de disponibilidade (agenda)
  - Criação e acompanhamento de orçamentos
  - Confirmação de agendamentos, execução do serviço (check-in/check-out)
  - Recebimento de pagamentos e avaliação de clientes

- Administrador:
  - Login
  - Gestão e acompanhamento de tickets de suporte
  - Dashboard e histórico de atendimentos

---

## Arquitetura (visão geral)

- **Camada HTTP (Express)**  
  Define rotas REST, middlewares de autenticação, tratamento de erros e logging.

- **Validação (Zod)**  
  Esquemas para:
  - `req.body`, `req.params`, `req.query`
  - Tipagem de DTOs internos
  - Normalização de responses

- **Camada de Domínio / Serviços**  
  Contém regras de negócio desacopladas da camada HTTP:
  - Casos de uso (use cases / services)
  - Orquestração entre repositórios, autenticação e eventos

- **Persistência (Prisma + PostgreSQL)**  
  - `schema.prisma` com models (User, Service, Budget, Booking, Payment, Ticket, etc.)
  - Migrations e seeds
  - Repositórios para acesso aos dados

- **Autenticação (Better Auth)**  
  - Fluxo de login/cadastro
  - Emissão/verificação de token/sessão
  - Proteção de rotas por role (cliente, prestador, admin)

---

## Requisitos

- Node.js (versão LTS atual)
- PostgreSQL em execução
- npm ou yarn instalado

---

## Configuração do ambiente

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/<org>/<repo>.git
   cd <repo>
2. **Instalar dependências**
   ```bash
   npm install
   # ou
   yarn install

3. Configurar variáveis de ambiente
  Crie um arquivo .env na raiz com, por exemplo:
    ```text
    DATABASE_URL="postgresql://user:password@localhost:5432/ajeita"
    BETTER_AUTH_SECRET="sua-chave-secreta"
    BETTER_AUTH_APP_URL="http://localhost:3000"
    NODE_ENV="development"
    PORT=3333
    ```

4. Executar migrations do Prisma
    ```bash
    npx prisma migrate dev
    ```
5. Iniciar o servidor em desenvolvimento
    ```bash
    npm run dev
    ```
