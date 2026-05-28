# Mapeamento de Funcionalidades do AjeitaAi (Fase 8)

Esta é a varredura completa da sua aplicação na **Fase 8** (antes da integração do AbacatePay). 
Abaixo está a listagem de **todas as funcionalidades** mapeadas pelas Entidades, passando pela camada de Domínio, UseCases, e finalizando nas Rotas da API e os dados exigidos no corpo da requisição ou parâmetros.

---

## 🧑 Entidade: User (Usuários)

Representa tanto os `CLIENT` (contratantes) quanto os `PROVIDER` (prestadores de serviços).

### 1. Cadastro de Cliente
- **Dados necessários:** `{ name, email, password? (opcional caso seja oauth), cpf, phone? }`
- **Rota:** `POST /clientes`
- **Acesso:** Público (Qualquer um pode criar).

### 2. Cadastro de Prestador
- **Dados necessários:** `{ name, email, password?, cpf, image? (avatar), phone?, birthDate, description }`
- **Rota:** `POST /prestadores`
- **Acesso:** Público.

---

## 🛠️ Entidade: Service (Serviços)

Representa as demandas publicadas pelos clientes aguardando propostas.

### 3. Criar Serviço (Publicar Demanda)
- **Dados necessários:** `{ title, description, images_url? (array), categoryIds (array de strings), city, neighborhood?, latitude?, longitude? }`
- **Observação:** O `client_id` é injetado através da autenticação.
- **Rota:** `POST /servicos`
- **Acesso:** Apenas perfis do tipo `CLIENT` autenticados.

### 4. Listar Serviços Disponíveis
- **Dados necessários (Query Params):** `{ page, limit, city?, categoryId? }`
- **Rota:** `GET /servicos`
- **Acesso:** Público (ou autenticado dependendo do middleware no front, mas o backend não restringe `role`). Retorna serviços no status `ABERTO`.

### 5. Detalhes do Serviço
- **Dados necessários (URL Params):** `{ id }`
- **Rota:** `GET /servicos/:id`
- **Acesso:** Público/Autenticado. Traz informações do cliente, total de orçamentos e status atual.

---

## 💰 Entidade: Budget (Orçamentos)

Representa as propostas enviadas pelos prestadores para um determinado serviço.

### 6. Criar Orçamento (Enviar Proposta)
- **Dados necessários:** `{ serviceId, price, description, estimatedDate }`
- **Observação:** O `providerId` é injetado via token de autenticação.
- **Rota:** `POST /orcamentos`
- **Acesso:** Apenas perfis do tipo `PROVIDER` autenticados.

### 7. Contra-Proposta (Atualizar Orçamento)
- **Dados necessários (Body):** `{ newPrice, newDate, newDescription, isFromClient }`
- **Dados necessários (URL Params):** `{ id }` (ID do Orçamento)
- **Rota:** `PATCH /orcamentos/:id/contra-proposta`
- **Acesso:** Apenas perfis do tipo `PROVIDER` autenticados. *(Nota: a regra de negócio permite a contra-proposta, mas a rota atualmente exige `PROVIDER`)*.

### 8. Aceitar Orçamento
- **Dados necessários (Body):** `{ serviceId }`
- **Dados necessários (URL Params):** `{ id }` (ID do Orçamento)
- **Rota:** `PATCH /orcamentos/:id/aceitar`
- **Acesso:** Apenas perfis do tipo `CLIENT` autenticados. Muda o status do orçamento para `ACEITO` e recusa os demais daquele serviço.

### 9. Listar Orçamentos de um Serviço
- **Dados necessários (Query Params):** `{ serviceId }`
- **Rota:** `GET /orcamentos`
- **Acesso:** Autenticado. Traz todos os orçamentos (com os dados do prestador) associados a um determinado serviço.

---

## 💬 Entidade: Message (Mensagens / Chat)

Responsável pela comunicação em tempo real entre prestador e cliente num orçamento em andamento.

### 10. Enviar Mensagem
- **Dados necessários:** `{ budgetId, text?, imageUrl? }`
- **Observação:** Requer que `text` ou `imageUrl` sejam fornecidos. O `senderId` é extraído do token de autenticação. Essa rota aciona o WebSocket (Socket.io) para emissão em tempo real na "Room" do `budgetId`.
- **Rota:** `POST /mensagens`
- **Acesso:** Autenticado.

### 11. Listar Mensagens do Chat
- **Dados necessários (URL Params):** `{ budgetId }`
- **Rota:** `GET /mensagens/:budgetId`
- **Acesso:** Autenticado. Traz o histórico completo da conversa associada ao Orçamento.

---

## 💳 Entidade: Payment (Pagamentos)

Responsável por registrar as transações financeiras de um Orçamento aprovado.

### 12. Criar Pagamento
- **Dados necessários:** `{ method, amount, budgetId, transactionId? }`
- **Observação:** O `clientId` vem da sessão autenticada. Se enviar um `transactionId`, ele assume que o pagamento já está como `PAGO` (fluxo atual antes da Fase 9).
- **Rota:** `POST /pagamentos`
- **Acesso:** Apenas perfis do tipo `CLIENT` autenticados.

---

## ⭐ Entidade: Review (Avaliações)

Responsável por avaliar o prestador de serviços após a finalização do trabalho.

### 13. Criar Avaliação
- **Dados necessários:** `{ rating, comment?, serviceId, reviewedId (ID do Prestador) }`
- **Observação:** O `reviewerId` vem da sessão autenticada. O serviço obrigatoriamente deve estar no status `FINALIZADO` para permitir a avaliação.
- **Rota:** `POST /avaliacoes`
- **Acesso:** Apenas perfis do tipo `CLIENT` autenticados.
