# Layout responsivo

Abaixo de 1024 px, o header é substituído pelo acesso visual ao catálogo e botão de filtros, com navegação inferior fixa. O Hero usa o texto compacto da referência mobile. O ícone central usa ShoppingBag do Lucide como aproximação visual da referência.

O catálogo usa duas colunas com deslocamento alternado no mobile/tablet e três no desktop largo. Os mesmos controles de filtro existentes aparecem em um Dialog lateral do Base UI em telas menores. O estado de abertura fica no layout compartilhado.

## API simulada e estado remoto

O catálogo é consultado em `/api/nfts` pelo cliente Axios e gerenciado pelo TanStack Query. A resposta REST inclui paginação e facets de categorias e redes. O catálogo apresenta skeleton durante o carregamento, estado vazio e recuperação de falha.

O MSW fica ativo por padrão e pode ser desabilitado com `VITE_ENABLE_MOCKS=false`. O banco mock usa a chave versionada `kurio:mock-db:v1` no `localStorage`, com fallback em memória, e mantém NFTs, sessões, perfis, favoritos, carrinhos, carteiras e pedidos. As fixtures incluem Ana e Bruno, com dados privados separados e apenas hashes das senhas fictícias.

Os endpoints internos `POST /api/__mock/scenario` e `POST /api/__mock/reset` selecionam um cenário determinístico e restauram integralmente as fixtures. Estão disponíveis `default`, `slow-network`, `empty-catalog`, `server-error`, `expired-session` e `cart-error`. Esses endpoints são exclusivos da simulação e serão usados pelo Playwright para isolar os testes.

O carrinho se transforma em cards abaixo de 640 px. Galeria, recomendações, pagamento, rodapé e modais ajustam suas dimensões sem depender de larguras fixas. A barra inferior reserva espaço e respeita a safe area. Os modais mantêm controle de foco e fechamento por Escape; transições respeitam movimento reduzido.

A interface de login usa mutations do TanStack Query contra os handlers MSW. A consulta de sessão é compartilhada entre os pontos de entrada desktop e mobile, persiste após refresh por cookie simulado e o logout limpa as queries privadas do usuário. O detalhe e os itens relacionados são consultados pela API REST, com skeleton, erro recuperável e resposta 404.

O carrinho usa os quatro endpoints REST de consulta e mutation. Visitantes são identificados pelo header persistente `X-Visitor-Id`; após o login, o handler une os itens do visitante ao carrinho privado do usuário respeitando a disponibilidade. Quantidade e remoção usam atualização otimista com snapshot do cache, rollback em falha e reconciliação com a API. O cenário `cart-error` torna essas falhas determinísticas. Cadastro, pagamento, cotação e favoritos ainda continuam demonstrativos.

## Verificação

`npm run test:responsive` usa Chromium em 390×844, 768×1024 e 1440×1000. Verifica ausência de overflow horizontal nas sete rotas existentes, erros JavaScript, modais de login/cadastro, restauração de foco, painel de filtros e navegação mobile. Gera capturas de home e carrinho em `test-results/` e relatório em `playwright-report/`.

Essas capturas são inspeções visuais, não baselines de regressão. Os testes não substituem a suíte E2E completa com MSW, Socket.IO ou a auditoria Lighthouse exigidas pelo desafio.
