# Mapeamento Completo e Auditoria do AjeitaAi (Fase 12)

Este documento apresenta uma análise detalhada da aplicação até a **Fase 12**, contendo todas as funcionalidades existentes e suas respectivas regras de negócio, além de propostas de melhoria estrutural e mapeamento de riscos atuais.

---

## 1. Funcionalidades Existentes e Regras de Negócio

### 🧑 Usuários e Autenticação (User & Auth)
- **Cadastro de Cliente e Prestador:**
  - O sistema separa contas através do campo `role` (`CLIENT` ou `PROVIDER`).
  - CPF, Email e Senha (criptografada) são dados mandatórios. O e-mail e o CPF devem ser únicos.
- **Gestão de Perfil:**
  - O usuário autenticado pode alterar informações parciais (nome, telefone, descrição, foto) via `PATCH /perfil`.
  - É possível alterar a senha (`POST /change-password`) desde que a senha antiga esteja correta.
- **Recuperação de Senha (Esqueci minha Senha):**
  - Integrado ao `better-auth` e o provedor **Resend**.
  - O fluxo gera um link temporal (Token) seguro para envio via e-mail e, através desse link, a nova senha é definida (`/reset-password`).

### 📍 Endereços (Address)
- **CRUD Completo:**
  - Usuários autenticados podem criar, listar, detalhar e excluir endereços próprios.
- **Regras de Exclusão:**
  - Um endereço **não pode ser excluído** caso ele tenha sido associado a algum Serviço histórico. Isso garante a integridade e evita que históricos de visitas desapareçam.
- **Endereço Principal:**
  - Através do `PATCH /enderecos/:id/principal`, o usuário pode tornar um endereço padrão.
  - A lógica utiliza uma *Transação* (`$transaction`) no banco de dados, que seta todos os outros endereços como `principal = false` simultaneamente, garantindo consistência.

### 🛠️ Serviços (Service)
- **Publicação:**
  - Exclusivo para clientes. O usuário aponta no máximo 3 categorias (Category), o ID do Endereço (Address) e preenche descrição, título e imagens. Status inicial: `ABERTO`.
- **Listagem e Detalhes:**
  - Clientes podem buscar seus próprios serviços.
  - Todos os usuários (prestadores) podem listar os serviços publicados e ver os detalhes.
- **Edição de Serviço:**
  - **Bloqueio de Dono:** Somente o Cliente que criou o serviço pode editá-lo.
  - **Bloqueio de Status:** Somente serviços no status `ABERTO` podem ser editados.
  - **Validações:** O serviço atualizado deve possuir no mínimo 100 caracteres de descrição e pelo menos 1 imagem de URL.
- **Exclusão de Serviço:**
  - Mesmo bloqueio de Dono e Status (Apenas `ABERTO`).
  - **Efeito Cascata:** Se existirem orçamentos (Budgets) atrelados ao serviço aberto, a exclusão do serviço excluirá também os orçamentos de forma transacional.

### 💰 Orçamentos (Budget)
- **Envio e Listagem:**
  - Prestadores submetem valores e datas estimadas ao serviço.
  - O prestador consegue listar todos os orçamentos submetidos por ele (`GET /orcamentos/me`), acompanhados das informações do Serviço e do Cliente, para sua própria gestão.
- **Negociação e Aceite:**
  - É possível o envio de uma "Contra-proposta" alterando os termos do orçamento.
  - **Aceite (Cliente):** Quando o cliente aceita um orçamento, o status desse orçamento vai para `ACEITO`. O Serviço ganha o `provider_id` atrelado a ele e o status do Serviço muda para `AGUARDANDO_PAGAMENTO`. Todos os demais orçamentos recebidos pelo serviço são automaticamente **recusados**.

### 💳 Pagamentos e Interações (Payment, Message & Review)
- **Chat (Messages):**
  - Usuários podem trocar mensagens de texto ou imagem (imageUrl) com base no ID de um Orçamento. Apenas os envolvidos podem listar.
- **Pagamentos (Payment):**
  - A rota de pagamento inicializa o objeto. *(Aguardando gateway final para preencher `transaction_id`).*
- **Avaliações (Review):**
  - Apenas serviços com Status `FINALIZADO` podem ser avaliados.
  - **Trava de Tempo:** Após o serviço ser finalizado (`end_date`), o cliente possui no máximo **2 dias** para submeter uma nota. Após 48 horas o sistema bloqueia essa ação.

---

## 2. Oportunidades de Melhoria

1. **Gestão e Upload Real de Arquivos (Imagens)**
   - No momento, os campos `images_url` e `image` (avatar) recebem apenas "Strings" (que representam a URL da foto).
   - **Melhoria:** Integrar um Storage externo (como AWS S3, Cloudinary ou Firebase Storage) utilizando bibliotecas (ex: `multer`), garantindo que o backend gere e retorne o link da imagem sem depender que o front envie um link pronto de fora.
2. **Paginação Refinada e Filtros Avançados**
   - As listagens (ex: buscar serviços abertos) correm o risco de crescer rápido demais no banco e atrasar a reposta da API.
   - **Melhoria:** Implementar uma paginação padrão com os campos *Limit*, *Offset* (ou cursor based) nas respostas e adicionar filtros como: Raio de Distância (GeoSpatial queries baseadas na lat/lng).
3. **Fila de Background Jobs (Workers)**
   - Ações pesadas estão embutidas no fluxo síncrono.
   - **Melhoria:** Usar algo como BullMQ ou Redis. Ex: quando o usuário Exclui um serviço, ao invés do processo HTTP parar para disparar notificação, ele põe a notificação numa fila e devolve resposta instantânea ao usuário.

---

## 3. Mapeamento de Riscos e Pontos de Atenção

1. **Privacidade e Geolocalização de Endereços Abertos**
   - Se o retorno dos detalhes de um serviço "ABERTO" retornar todo o logradouro (`rua`, `numero`, `complemento`), qualquer usuário pode descobrir exatamente a casa do cliente.
   - **Risco de Segurança Física e LGPD:** O ideal é que o DTO público omita rua/numero/complemento e exponha apenas **Cidade/Bairro/Estado**. O endereço completo só deve aparecer para o `Provider` após o Serviço entrar em `APROVADO`.
2. **Concorrência de Aceite de Orçamento (Race Conditions)**
   - Caso um cliente rápido e ansioso aperte o botão "Aceitar Orçamento" para 2 prestadores simultaneamente em abas diferentes, 2 requisições farão a validação ao mesmo tempo antes que a base de dados perceba o aceite.
   - **Risco de Inconsistência:** Pode resultar em dois orçamentos "ACEITOS" para um mesmo serviço.
   - **Solução:** Aplicar *Locks* (ex: `SELECT ... FOR UPDATE` no Prisma, utilizando uma query transacional robusta) ou conferir ativamente durante a transação de aceite se o `status` do Serviço ainda é `ABERTO` no mesmo nível da clausula `WHERE`.
3. **Deleção da Conta do Usuário (Hard Delete vs Soft Delete)**
   - Se um usuário resolver que quer excluir sua conta, a LGPD manda apagar os dados. Mas se aplicarmos um simples `DELETE` no `User`, teremos falha de ForeignKey por causa dos `Restricts` que fizemos nas Avaliações e Endereços e Orçamentos.
   - **Risco:** O processo de "Encerrar minha Conta" vai quebrar a API.
   - **Solução:** É urgente repensar a tática para "Exclusão de Conta" - possivelmente adotando *Soft Delete* (onde o usuário ganha um status de inativo ou é anonimizado), mantendo a integridade fiscal, contábil e histórica.
4. **Spoofing Financeiro**
   - Como ainda não há webhook travado, se a requisição passar diretamente pelo controller de criação do Payment fingindo estar "PAGO" com qualquer hash de transação, o sistema vai aceitar.
   - A dependência total de integração segura na **Fase 14 (AbacatePay)** exige atenção máxima na verificação via assinatura (assinatura de webhook) de quem disparou a alteração.
