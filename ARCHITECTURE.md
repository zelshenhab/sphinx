# SPHINX architecture

The application uses a feature-first structure while keeping Next.js routes thin.

## Layers

- `app/` — routing, layouts and page composition only.
- `features/` — business capabilities. Each feature exposes a small public API through `index.ts`.
- `components/` — application-wide UI and providers that are not owned by one feature.
- `core/` — framework-agnostic infrastructure such as browser storage adapters.
- `config/` — typed brand, navigation and integration configuration.
- `types/` — shared domain contracts grouped by business area.
- `public/` — static brand and product assets.

## Feature boundaries

- `features/catalog` owns products, categories and product presentation.
- `features/cart` owns cart state and storefront cart interactions.
- `features/admin` owns reusable dashboard UI.
- `features/i18n` owns locale state and storefront translations.

Pages import features from their public `index.ts`, not from internal files. This keeps internal refactors from affecting routes.

## Replacing prototype infrastructure

`core/storage/client-storage.ts` is the temporary persistence boundary. When a backend is introduced, create repositories/services inside the relevant feature and replace calls to this adapter. UI components should not call `localStorage` directly.

Recommended future additions:

1. `core/http/` for the API client and error handling.
2. `features/auth/` for admin authentication and authorization.
3. `features/orders/` for checkout, payment and order lifecycle.
4. `features/shipping/` for delivery providers and address validation.
5. A server-side repository layer backed by PostgreSQL or another production database.
