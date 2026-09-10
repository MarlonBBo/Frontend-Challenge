# Layout responsivo

Abaixo de 1024 px, o header é substituído pelo acesso visual ao catálogo e botão de filtros, com navegação inferior fixa. O Hero usa o texto compacto da referência mobile. A arte secundária é um recorte circular do asset existente, pois não há recorte transparente disponível. O ícone central usa ShoppingBag do Lucide como aproximação visual da referência.

O catálogo usa duas colunas com deslocamento alternado no mobile/tablet e três no desktop largo. Os mesmos controles de filtro existentes aparecem em um Dialog lateral do Base UI em telas menores. O estado de abertura fica no layout compartilhado.

## API simulada e estado remoto

O catálogo é consultado em `/api/nfts` pelo cliente Axios e gerenciado pelo TanStack Query. A resposta REST inclui paginação e facets de categorias e redes. O catálogo apresenta skeleton durante o carregamento, estado vazio e recuperação de falha.

O MSW fica ativo por padrão e pode ser desabilitado com `VITE_ENABLE_MOCKS=false`. O banco mock usa a chave versionada `kurio:mock-db:v1` no `localStorage`, com fallback em memória, e mantém NFTs, sessões, perfis, favoritos, carrinhos, carteiras e pedidos. As fixtures incluem Ana e Bruno, com dados privados separados e apenas hashes das senhas fictícias.

Os endpoints internos `POST /api/__mock/scenario` e `POST /api/__mock/reset` selecionam um cenário determinístico e restauram integralmente as fixtures. Estão disponíveis `default`, `slow-network`, `empty-catalog`, `server-error` e `expired-session`. Esses endpoints são exclusivos da simulação e serão usados pelo Playwright para isolar os testes.

O carrinho se transforma em cards abaixo de 640 px. Galeria, recomendações, pagamento, rodapé e modais ajustam suas dimensões sem depender de larguras fixas. A barra inferior reserva espaço e respeita a safe area. Os modais mantêm controle de foco e fechamento por Escape; transições respeitam movimento reduzido.

O handler de login e a recuperação de sessão já existem na camada MSW, mas a interface de login ainda não foi conectada a eles. Cadastro, pagamento e carrinho continuam demonstrativos. A barra de busca mobile é um link para o catálogo; favoritos da barra inferior continuam desativados. O detalhe ainda usa o loader local e será migrado em uma etapa posterior.

## Verificação

`npm run test:responsive` usa Chromium em 390×844, 768×1024 e 1440×1000. Verifica ausência de overflow horizontal nas sete rotas existentes, erros JavaScript, modais de login/cadastro, restauração de foco, painel de filtros e navegação mobile. Gera capturas de home e carrinho em `test-results/` e relatório em `playwright-report/`.

Essas capturas são inspeções visuais, não baselines de regressão. Os testes não substituem a suíte E2E completa com MSW, Socket.IO ou a auditoria Lighthouse exigidas pelo desafio.
