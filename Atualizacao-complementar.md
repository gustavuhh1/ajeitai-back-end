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

## Fase 9: Integração de Pagamentos (AbacatePay)
- [ ] Instalar o SDK oficial (`npm install @abacatepay/sdk`) e configurar as chaves no `.env`.
- [ ] Criar fluxo de "Onboarding" para Prestadores (cadastrar conta recebedora/chave PIX no AbacatePay).
- [ ] Atualizar o Prisma (`User` e `Payment`) para guardar IDs do AbacatePay e URLs de Checkout.
- [ ] Refatorar o `CreatePaymentUseCase` para gerar a transação (Checkout/Pix) no AbacatePay na hora do aceite do orçamento.
- [ ] Criar um Webhook Endpoint (`POST /webhooks/abacatepay`) para escutar quando o cliente de fato pagar, e atualizar o `status` do serviço e do pagamento no banco de dados.
- [ ] Criar fluxo de Cancelamento de Serviço e Reembolso (`RefundPaymentUseCase`), utilizando a API do AbacatePay para estornar o valor pago caso o serviço ainda não tenha sido iniciado ou finalizado.

## Fase 10: Deploy e Preparação do Ambiente
- [x] Substituir o compilador padrão `tsc` pelo `tsup` para melhor performance e resolução de *path aliases* (`@/`).
- [x] Atualizar o script de `"build"` no `package.json` para utilizar `tsup src/server.ts --format cjs --clean`.
- [x] Validar e configurar o script de `"start"` para rodar a versão compilada (`node dist/server.js`).
- [x] Instalar dependência de desenvolvimento do tsup (`npm install tsup -D`).

## Fase 11: Refatoração de Endereços (Address)
- [x] Atualizar o model `Address`:
  - Mudar os atributos para Português (Pt-br): `rua`, `numero`, `ponto_de_referencia`, `cep`, `complemento`, `cidade`, `estado`.
  - Adicionar os campos `latitude` e `longitude` (transferidos de Service para Address).
  - Adicionar o campo booleano `principal` para definir o endereço principal.
  - Remover o campo `type`.
  - Tornar o campo `complemento` o único opcional.
- [x] Adaptar o fluxo de Criação de Endereço (API):
  - Validar e salvar latitude e longitude enviadas pelo *body* pelo frontend (via Geocoding/CEP).
  - Atualizar o `CreateAddressUseCase` para impor o limite máximo de 5 endereços por usuário.
- [x] Atualizar o model `Service`:
  - Remover os campos `latitude`, `longitude`, `city` e `neighborhood`.
  - Adicionar relação com `Address` (um serviço possui 1 endereço, um endereço pode ser usado em vários serviços).
- [x] Criar rotas da API para gerenciamento de Endereços:
  - Adicionar endereço (`POST /addresses`).
  - Listagem de endereços e busca (`GET /addresses`).
  - Buscar endereço por ID (`GET /addresses/:id`).
  - Excluir endereço (`DELETE /addresses/:id`).
  - Definir endereço como principal (`PATCH /addresses/:id/principal`).
- [x] Funcionalidade de Endereço Principal (`TogglePrincipal`):
  - Implementar método `togglePrincipal` no repositório (`Prisma` e `In-Memory`), utilizando transação (`$transaction`) para setar `false` nos outros endereços e `true` no endereço selecionado do usuário.
  - Criar `TogglePrincipalAddressUseCase` e disponibilizar via rota `PATCH /addresses/:id/principal`.
- [x] Regras de Negócio na Exclusão de Endereço (`DeleteAddressUseCase`):
  - Implementar o método `countByAddressId` no `IServiceRepository`.
  - Bloquear a exclusão de um endereço caso ele possua serviços atrelados (garantir integridade dos dados históricos).
- [x] Atualizar a lógica de Usuários e Pagamentos:
  - Permitir a seleção do `address_id` no momento da criação do serviço.
  - Ajustar o fluxo financeiro e os UseCases (`CreateServiceUseCase`, `CreateBudgetUseCase`, `CreateReviewUseCase`, `GetServiceDetailsUseCase`, `ListAvailableServicesUseCase`) para consumirem `address_id` ao invés da antiga propriedade `city`.

## Fase 12: Funcionalidades Complementares (Integração Front-end)
- [x] **Listagem de Serviços do Cliente:**
  - Criar Rota/UseCase/Repositório para buscar todos os serviços criados pelo usuário autenticado (Cliente).
  - Ordenar os resultados por `updatedAt` (dos mais recentes para os mais antigos).
- [x] **Atualização de Perfil (Usuário):**
  - Criar rota `PATCH` para atualizar informações mutáveis do usuário (`telefone`, `nome`, `descrição`, `image`).
  - O endpoint deve aceitar *body* parcial, atualizando apenas os campos que forem enviados.
- [x] **Redefinição de Senha (Logado):**
  - Criar Rota/UseCase para alterar a senha fornecendo `senhaAntiga` e `senhaNova`, utilizando os recursos do `better-auth`.
- [x] **Recuperação de Senha (Esqueci minha senha):**
  - Implementar Rota/UseCase para enviar e-mail com link de recuperação.
  - Integrar o serviço terceirizado **Resend** para realizar o disparo real e seguro dos e-mails aos usuários.
  - O front-end validará a URL e o back-end processará a redefinição utilizando as funções do `better-auth`.
- [x] **Edição de Serviço:**
  - Criar rota `PATCH` para alteração de informações do serviço (`images_url`, `description`, `title`, `endereço`).
  - Garantir que apenas o Cliente autor do serviço possa realizar a alteração.
  - O endpoint deve aceitar atualizações parciais.
- [x] **Exclusão de Serviço:**
  - Criar Rota/UseCase para o cliente excluir um serviço permanentemente.
  - **Regra de Negócio:** A exclusão só será permitida se o `StatusService` estiver como `ABERTO`.
  - Realizar exclusão em cascata: excluir também os orçamentos (budgets) que estiverem em aberto atrelados ao serviço.
- [x] **Regra de Prazo para Avaliação (Review):**
  - Atualizar o UseCase de avaliações para checar a data de finalização.
  - Se o serviço foi `FINALIZADO` há mais de 2 dias, o sistema deve impossibilitar o usuário de enviar uma avaliação.

## Fase 13: Central de Notificações em Tempo Real (Socket.IO + Prisma)
- [ ] **Modelagem (Prisma):**
  - Criar o model `Notification` no `schema.prisma`.
  - Definir campos: `id`, `userId` (relação com User), `title`, `message`, `type` (ex: NEW_QUOTE, NEW_MESSAGE, STATUS_CHANGE, SERVICE_DELETED), `isRead` (default: false), `link` (opcional), `createdAt`.
- [ ] **Infraestrutura em Tempo Real (Express):**
  - Instalar e configurar o `socket.io` junto ao servidor HTTP (`server.ts`).
  - Criar middleware de autenticação para as conexões do socket, garantindo que apenas usuários autenticados conectem.
  - Implementar lógica para cada usuário ingressar em uma "sala" (room) própria baseada no seu ID.
- [ ] **Rotas REST (Sincronização do Front-end):**
  - `GET /api/notifications`: Buscar o histórico de notificações do usuário (ordenado do mais recente para o mais antigo).
  - `PATCH /api/notifications/mark-as-read`: Marcar notificações selecionadas (ou todas) como lidas.
- [ ] **Emissão de Eventos (Casos de Uso):**
  - Interceptar as ações principais e disparar notificações (Salvar no Prisma + Emitir via Socket.IO):
    - Novo orçamento recebido (Cliente notificado).
    - Novas mensagens recebidas na negociação (Ambos).
    - Status do orçamento/serviço alterado (contra-proposta, aceito, pago, finalizado) (Ambos).
    - Serviço excluído (Prestadores notificados).
