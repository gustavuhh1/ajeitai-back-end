# Tarefas de Atualização Complementar (Refatoração do Fluxo)

Este documento é a nossa fonte da verdade para o andamento da refatoração do back-end, organizado da raiz (Banco de Dados) para as folhas (Rotas/Controllers).

## Fase 1: Banco de Dados (Prisma)
- [x] Remover o model `Booking`.
- [x] Atualizar o enum `StatusService` (ABERTO, AGUARDANDO_PAGAMENTO, APROVADO, EM_ANDAMENTO, FINALIZADO, CANCELADO).
- [x] Renomear `BookingStatus` para `BudgetStatus` e atualizar (AGUARDANDO_CLIENTE, AGUARDANDO_PRESTADOR, ACEITO, PAGO, RECUSADO).
- [x] Atualizar o enum `PaymentsStatus` (PENDENTE, PAGO, FALHOU, REEMBOLSADO).
- [x] Atualizar model `Service`: adicionar status correto.
- [x] Atualizar model `Budget`: remover relação com Booking, atualizar status.
- [x] Atualizar model `Payment`: atrelar a `Budget` em vez de `Booking`.
- [x] Atualizar model `Review`: atrelar a `Service` em vez de `Booking`.
- [x] Criar model `Message` (Chat): atrelado a `Budget`, com campos `id`, `text`, `imageUrl`, `senderId`, `createdAt`.
- [x] Gerar e aplicar a migration (`npx prisma migrate dev`).

## Fase 2: Repositórios e Entidades
- [x] Atualizar/Criar Entidades de Domínio (`src/entities/Service.ts`, `Budget.ts`, `Message.ts`).
- [x] Deletar `IBookingRepository` e sua implementação (`PrismaBookingRepository`).
- [x] Atualizar `IServiceRepository` e `PrismaServiceRepository` (novos status, remover referências de Booking).
- [x] Atualizar `IBudgetRepository` e `PrismaBudgetRepository` (novos status, busca simplificada).
- [x] Criar `IMessageRepository` e `PrismaMessageRepository`.
- [x] Atualizar repositórios de `Payment` e `Review` para as novas relações.

## Fase 3: Limpeza e Refatoração de Repositórios
- [x] Refinar Entidades com métodos de domínio (Criar `Payment` e `Review`, adicionar métodos no `Budget` e `Service`).
- [x] Deletar todos os arquivos das pastas `src/repositories`, `src/usecases` e `src/controllers`.
- [x] Reconstruir Interfaces na raiz (`src/repositories/IUserRepository.ts`, `IServiceRepository.ts`, etc).
- [x] Reconstruir Implementações dentro da pasta Prisma (`src/repositories/prisma/PrismaUserRepository.ts`, etc).
- [x] Repositórios a serem refeitos: `User`, `Category`, `Service`, `Budget`, `Message`, `Payment`, `Review`, `ResetToken`.

## Fase 4: Camada de UseCases e Factories
- [x] Adicionar campos adicionais no better-auth (avatar, biografia e média de avaliação) e prisma e fazer a migração.
- [x] Criar UseCases focados nas rotas que o Frontend vai consumir.
- [x] Aplicar o padrão de Injeção de Dependência através da pasta `src/usecases/factories`.
- [x] Recriar fluxo de Usuários (Registro, Login, Senha).
- [x] Recriar fluxo de Serviços (Criação, Listagem, Detalhes).
- [x] Refatorar Serviço para aceitar múltiplas Categorias (N:M, máximo 3) melhorando alcance nas buscas.
- [x] Recriar fluxo de Orçamento e Chat (Nova oferta, Contra-proposta, Aceite, Envio de Mensagem).
- [x] Recriar fluxo Financeiro e Finalização (Pagamento e Avaliação).

## Fase 5: Camada de Controllers
- [x] Criar Controllers enxutos para cada UseCase.
- [x] Implementar validação de dados com `zod` e capturar `request/response`.
- [x] Chamar as instâncias através das Factories criadas na Fase 4.

## Fase 6: Camada de Rotas (Routes)
- [x] Limpar e refazer os arquivos de rotas em `src/routes/`.
- [x] Conectar os novos Controllers nas suas respectivas rotas.
- [x] Integrar as rotas nativas do **better-auth** (que lidam automaticamente com o Login, Logout e Sessão da aplicação) sem precisarmos criar um `LoginController` manual.
- [x] Aplicar os middlewares de autenticação (`ensureAuthenticated` via better-auth) onde for necessário.

## Fase 7: Testes Unitários (In-Memory)
- [x] Ambiente de testes configurado (Vitest e scripts no package.json).
- [x] Criar repositórios "In-Memory" (`src/repositories/in-memory/`) implementando as interfaces para rodar os testes sem o Prisma.
- [x] Criar os arquivos de testes em `src/usecases/tests/` cobrindo todos os UseCases (Usuários, Serviços, Orçamentos, Chat, Financeiro).

## Fase 8: Chat em Tempo Real (WebSockets)
- [x] Instalar o `socket.io` no backend e refatorar o `server.ts` para acoplar o servidor HTTP ao WebSocket.
- [x] Criar estrutura de "Salas" (`Rooms`) baseadas no ID do Orçamento (`budgetId`).
- [x] Implementar eventos de conexão, desconexão, `join_room` e emissão de mensagens (`send_message`).
- [x] Atualizar o UseCase `SendMessageUseCase` para disparar notificações via Socket além de salvar no banco de dados.
