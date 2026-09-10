# Layout responsivo

Abaixo de 1024 px, o header é substituído pelo acesso visual ao catálogo e botão de filtros, com navegação inferior fixa. O Hero usa o texto compacto da referência mobile. O ícone central usa ShoppingBag do Lucide como aproximação visual da referência.

O catálogo usa duas colunas com deslocamento alternado no mobile/tablet e três no desktop largo. Os mesmos controles de filtro existentes aparecem em um Dialog lateral do Base UI em telas menores. O estado de abertura fica no layout compartilhado.

## API simulada e estado remoto

O catálogo é consultado em `/api/nfts` pelo cliente Axios e gerenciado pelo TanStack Query. A resposta REST inclui paginação e facets de categorias e redes. O catálogo apresenta skeleton durante o carregamento, estado vazio e recuperação de falha.

O MSW fica ativo por padrão e pode ser desabilitado com `VITE_ENABLE_MOCKS=false`. O banco mock usa a chave versionada `kurio:mock-db:v1` no `localStorage`, com fallback em memória, e mantém NFTs, sessões, perfis, favoritos, carrinhos, cotações, carteiras e pedidos. As fixtures incluem Ana e Bruno, com dados privados separados e apenas hashes das senhas fictícias.

Os endpoints internos `POST /api/__mock/scenario` e `POST /api/__mock/reset` selecionam um cenário determinístico e restauram integralmente as fixtures. Estão disponíveis `default`, `slow-network`, `empty-catalog`, `server-error`, `expired-session`, `cart-error`, `invalid-coupon`, `expired-coupon`, `price-changed`, `edition-sold-out` e `quote-expired`. Esses endpoints são exclusivos da simulação e serão usados pelo Playwright para isolar os testes.

O carrinho se transforma em cards abaixo de 640 px. Galeria, recomendações, pagamento, rodapé e modais ajustam suas dimensões sem depender de larguras fixas. A barra inferior reserva espaço e respeita a safe area. Os modais mantêm controle de foco e fechamento por Escape; transições respeitam movimento reduzido.

A interface de login usa mutations do TanStack Query contra os handlers MSW. A consulta de sessão é compartilhada entre os pontos de entrada desktop e mobile, persiste após refresh por cookie simulado e o logout limpa as queries privadas do usuário. O detalhe e os itens relacionados são consultados pela API REST, com skeleton, erro recuperável e resposta 404.

O carrinho usa os quatro endpoints REST de consulta e mutation. Visitantes são identificados pelo header persistente `X-Visitor-Id`; após o login, o handler une os itens do visitante ao carrinho privado do usuário respeitando a disponibilidade. Quantidade e remoção usam atualização otimista com snapshot do cache, rollback em falha e reconciliação com a API. O cenário `cart-error` torna essas falhas determinísticas.

`POST /api/quotes` é a única fonte dos valores exibidos no resumo. A chave da consulta contém a versão do carrinho e o cupom, portanto qualquer mutation gera nova cotação e respostas de uma versão anterior não substituem a atual. A cotação valida cupom, preço e disponibilidade, persiste um snapshot com expiração e bloqueia o avanço enquanto expirada ou com divergências. O aceite explícito sincroniza preço/quantidade do carrinho com o catálogo, incrementa sua versão e solicita outra cotação. Pagamento, cadastro e favoritos ainda continuam demonstrativos.

## Tempo real

O cliente usa `socket.io-client` com transporte WebSocket e conecta somente depois da inicialização dos mocks. No ambiente simulado, `ws.link` do MSW intercepta a conexão e `@mswjs/socket.io-binding` codifica e decodifica o protocolo Socket.IO. O handler de cenário persiste primeiro a mudança no banco e então publica `nft.updated`, mantendo REST e eventos coerentes.

`RealtimeSync` aplica eventos mais novos diretamente aos caches de listagem e detalhe, atualiza a disponibilidade visível no carrinho e invalida a cotação ativa. Cada recurso mantém uma versão; eventos duplicados ou com versão menor ou igual são descartados. Em toda reconexão, catálogo, carrinho e cotação são reconciliados pela API REST. Listeners são removidos e a conexão é encerrada no fim do ciclo de vida ou na troca de sessão.

A simulação suporta apenas o namespace padrão e não implementa rooms ou broadcasting por usuário, limitações atuais do binding. O fluxo usa exclusivamente WebSocket, sem fallback para long polling. O endpoint interno `GET /api/__mock/realtime` expõe apenas a contagem de clientes para sincronização determinística dos testes.

## Verificação

`npm run test:responsive` usa Chromium em 390×844, 768×1024 e 1440×1000. Verifica ausência de overflow horizontal nas sete rotas existentes, erros JavaScript, modais de login/cadastro, restauração de foco, painel de filtros e navegação mobile. Gera capturas de home e carrinho em `test-results/` e relatório em `playwright-report/`.

Essas capturas são inspeções visuais, não baselines de regressão. A suíte E2E já cobre REST, sessão, carrinho, cotação e a atualização `nft.updated` pelo cliente Socket.IO; eventos de pedido e a auditoria Lighthouse ainda precisam ser implementados.
