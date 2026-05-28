2. O Cliente Pede Ajuda
O que faz: CreateServiceUseCase.
Como se encaixa no fluxo: O cliente entra no app e cria um pedido de serviço (ex: "Consertar ar condicionado"). O sistema salva a localização, fotos (images_url), categoria e deixa o serviço com o status ABERTO.

3. O Prestador Procura Trabalho
O que faz: ListAvailableServicesUseCase e GetServiceDetailsUseCase.
Como se encaixa no fluxo: O prestador entra na Home do app. O sistema puxa apenas os serviços ABERTOS na cidade dele. Ele clica em um serviço e consegue ver os detalhes completos e quem é o cliente.

4. A Negociação (O Coração do App)
O que faz: CreateBudgetUseCase, CounterProposalUseCase, SendMessageUseCase e ListMessagesUseCase.
Como se encaixa no fluxo:
O prestador manda o seu preço e data (CreateBudget).
O cliente acha caro e envia uma contra-proposta (CounterProposal). O status do orçamento fica pingando de AGUARDANDO_CLIENTE para AGUARDANDO_PRESTADOR.
Enquanto isso, os dois podem conversar no chat trocando textos ou imagens da parede rachada (SendMessage).

5. O Fechamento de Negócio
O que faz: AcceptBudgetUseCase.
Como se encaixa no fluxo: O cliente gosta do preço e clica em "Aceitar". O sistema faz uma mágica no banco de dados: ele muda o orçamento para ACEITO, recusa automaticamente todos os outros orçamentos que outros prestadores mandaram, vincula o prestador escolhido àquele serviço e muda o status do serviço para AGUARDANDO_PAGAMENTO.

6. O Dinheiro na Mesa
O que faz: CreatePaymentUseCase.
Como se encaixa no fluxo: O cliente faz o PIX/Cartão. O UseCase registra o pagamento com a transação gerada. O serviço então está pronto para ser "Aprovado" e o trabalho começar. (No app, o prestador mudaria o status para EM_ANDAMENTO e depois FINALIZADO direto pela Entidade).

7. O Fim do Serviço e a Avaliação
O que faz: CreateReviewUseCase.
Como se encaixa no fluxo: O trabalho termina (FINALIZADO). O cliente dá 5 estrelas. O nosso sistema trava para que só serviços finalizados recebam nota, cria a review, calcula a nova média do prestador automaticamente em milissegundos e já salva no perfil dele.