# React + TypeScript + Vite

## API simulada

O MSW é iniciado por padrão e intercepta as chamadas Axios feitas para `/api`. Para executar sem mocks, copie `.env.example` para `.env` e defina `VITE_ENABLE_MOCKS=false`.

Credenciais fictícias disponíveis nos handlers:

- `ana@kurio.test` / `Kurio123!`
- `bruno@kurio.test` / `Arte456!`

O login, a recuperação da sessão, o logout, o catálogo e o detalhe do NFT já consomem essa API simulada por Axios e TanStack Query.

O carrinho também utiliza a API simulada: pode receber itens do detalhe, alterar quantidades e remover itens, persiste após refresh e une o estado visitante à conta autenticada. O cenário `cart-error` permite verificar o rollback das atualizações otimistas. O resumo vem de `POST /api/quotes`, valida cupons, recalcula após mutations e exige aceite quando preço ou estoque divergem do carrinho. Cupons válidos para demonstração: `KURIO10` (10%) e `GENESIS` (0,50 ETH, limitado ao subtotal).

O estado simulado persiste no `localStorage`. Use `POST /api/__mock/reset` para restaurar as fixtures ou `POST /api/__mock/scenario` com `{ "scenario": "empty-catalog" }` para selecionar um cenário. Os cenários atuais são `default`, `slow-network`, `empty-catalog`, `server-error`, `expired-session`, `cart-error`, `invalid-coupon`, `expired-coupon`, `price-changed`, `edition-sold-out` e `quote-expired`.

O evento `nft.updated` usa `socket.io-client` sobre WebSocket e é interceptado pelo MSW com `@mswjs/socket.io-binding`. Para reproduzir uma atualização enquanto o carrinho estiver aberto, envie `POST /api/__mock/scenario` com `{ "scenario": "price-changed" }` ou `{ "scenario": "edition-sold-out" }`. O mesmo estado atualizado passa a ser retornado pela API REST. Fora dos mocks, `VITE_SOCKET_URL` pode apontar para o servidor Socket.IO; vazio utiliza a origem da aplicação.

## Verificação de responsividade

Após `npm install`, execute `npx playwright install chromium` e `npm run test:responsive`. Os testes verificam os layouts em 390, 768 e 1440 px. Para abrir o relatório, use `npx playwright show-report`. Decisões de layout e limitações estão em `ARCHITECTURE.md`.

## Rotas da aplicação

A aplicação usa [TanStack Router com rotas definidas em código](https://tanstack.com/router/latest/docs/routing/code-based-routing), em `src/router.ts`.

- `/`: página inicial completa.
- `/mercado`: catálogo e filtros.
- `/mercado/$nftId`: detalhes do NFT (exemplo: `/mercado/0`). IDs inexistentes exibem a página 404. Os dados são compartilhados em `src/data/nfts.ts`; compra e avaliações são demonstrativas e o favorito é mantido apenas durante a visita à página.
- `/criadores`: banners de descoberta já existentes.
- `/aprenda`: Diário da Cunhagem.
- Endereços desconhecidos exibem a página de erro 404.

`App.tsx` é o layout compartilhado com header, `Outlet` e rodapé. `main.tsx` registra o `RouterProvider`. Use `Link` do TanStack Router para links internos; nos botões shadcn/Base UI, use `render={<Link to="/mercado" />}` e `nativeButton={false}`.

Ao publicar, configure o servidor para servir `index.html` nas rotas da aplicação (fallback de SPA), permitindo abrir ou atualizar `/mercado`, `/criadores` e `/aprenda` diretamente. O servidor de desenvolvimento do Vite já oferece esse fallback.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
