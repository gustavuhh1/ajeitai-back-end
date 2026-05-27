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
- [ ] Deletar `IBookingRepository` e sua implementação (`PrismaBookingRepository`).
- [ ] Atualizar `IServiceRepository` e `PrismaServiceRepository` (novos status, remover referências de Booking).
- [ ] Atualizar `IBudgetRepository` e `PrismaBudgetRepository` (novos status, busca simplificada).
- [ ] Criar `IMessageRepository` e `PrismaMessageRepository`.
- [ ] Atualizar repositórios de `Payment` e `Review` para as novas relações.

## Fase 3: Use Cases (Regras de Negócio)
- [ ] Deletar Use Cases referentes a `Booking`.
- [ ] Refatorar `CreateBudgetUseCase`: Criação da primeira oferta pelo prestador.
- [ ] Criar `CounterProposalUseCase`: Atualizar valor/data do Budget e mudar o status de quem deve aceitar.
- [ ] Refatorar `AcceptBudgetUseCase`: Aprovação do orçamento e transição do Serviço para `AGUARDANDO_PAGAMENTO`.
- [ ] Criar `SendMessageUseCase`: Lógica para salvar mensagens do chat e vincular url da imagem.
- [ ] Criar `ListMessagesUseCase`: Retornar histórico do chat do orçamento.
- [ ] Atualizar lógica de Pagamento simulado: Transita Serviço para `APROVADO` e Budget para `PAGO`.
- [ ] Criar lógica para transição de Serviço (`EM_ANDAMENTO` e `FINALIZADO`).

## Fase 4: Infraestrutura, Controllers e Rotas
- [ ] Remover Controllers e Rotas de `Booking`.
- [ ] Configurar pasta estática local (`/public/uploads`) para receber imagens.
- [ ] Criar Rota/Controller de Upload de Imagens.
- [ ] Criar Controllers para o Chat (`Message`).
- [ ] Refatorar Controllers de Orçamento (Criação, Contra-proposta, Aceite).
- [ ] Refatorar Controllers de Pagamento e Avaliação.
- [ ] Instalar e configurar WebSockets (`Socket.io`) no `server.ts`.
- [ ] Implementar emissão e recepção de eventos de chat via Socket.io.
