# Commerce hardening — staged, not deployed

## Deployment gate

The frontend now requires `save_product_safely` and `create_store_order_v2`.
Do not deploy the frontend against the old database. No production database changes
have been executed by this task.

1. Take a database backup and test on a Supabase staging project first.
2. Apply `supabase/migrations/202609060001_inventory_safety.sql` then
   `supabase/migrations/202609060002_order_receipts.sql`, then
   `supabase/migrations/202609060003_admin_reports.sql`.
3. Enable pg_cron in Supabase and schedule once:

   ```sql
   select cron.schedule('sphinx-expire-reservations', '*/5 * * * *',
     'select public.expire_store_reservations()');
   ```

4. Run a staging order, retry the same token, verify one reservation, confirm its
   dashboard reference, and cancel it to verify restoration.
5. Coordinate production migration and frontend deployment during a maintenance
   window: migration 2 intentionally revokes the old public checkout RPC.
6. Confirm orders/admin edits and the cron job on production before reopening.

Reservations last 24 hours while status is `new`. The admin must move a contacted
order to `contacted` or `confirmed` to preserve its reservation. Expired `new`
orders are cancelled. Existing legacy orders have no expiry assigned.

Coupons: one best automatic rule OR the explicit submitted code; no stacking.
BOGO gives one free identical product/color/size per pair. A successful reservation
uses a coupon slot; cancellation releases that slot. Invalid coupons roll back
the entire order transaction.

The included phone-based order throttle is not a substitute for edge-level bot
protection: attackers can vary phone numbers. Configure an edge rate limit before
high-volume public launch.

Tracking data migrates from public settings to the admin-protected orders table.
The old tracking settings are deleted after copying; the original data remains
in `orders.tracking_number`. Inventory changes are recorded in the private
`inventory_movements` table.
Product creation and deletion are transactional, and an unfinished checkout restores
its immutable receipt after a reload instead of creating a second reservation.

## Verified locally

- ESLint, TypeScript and production build.
- PostgreSQL via PGlite: migration syntax, receipt totals/references, retry
  idempotency, inventory compare-and-swap, price-only edits preserving stock,
  percentage/fixed/BOGO/automatic/collection coupon behavior and rollback,
  expiration exactly once, pause enforcement, server-side reports and paging,
  inventory audit creation, and anonymous privilege restrictions.
- Chrome mobile smoke test: shop at 390px without horizontal overflow; product
  navigation and metadata; no page errors in that flow.

Run SQL tests with a temporary PGlite installation:

```text
node scripts/test-commerce.mjs /absolute/path/to/@electric-sql/pglite/dist/index.js
```

No live order was submitted; no production customer data was modified.

## Remaining work before calling the entire audit complete

- Add a paid amount/date workflow if actual collected revenue is needed. Current
  reporting explicitly counts delivered-order value, not proof of payment.
- Add distributed edge abuse protection, and test real concurrent requests on
  staging; PGlite tests are sequential and cannot prove production concurrency.
- Full real-device accessibility and performance measurement.
- Complete legal seller information and per-product measurements using actual
  owner-provided values. Settings/editor controls are connected; no values invented.
- End-to-end checkout and admin smoke tests after applying migrations to staging.

Code is intentionally held from production pending database access/coordination.
