# Supabase setup

1. Open the Supabase project dashboard and go to **SQL Editor**.
2. Run `migrations/202609010001_initial_schema.sql`.
3. In **Authentication → Users**, create the first admin user.
4. Run the final commented `update public.profiles ...` statement with that email.
5. Sign in at `/admin/login`.

The publishable key is used by the browser and is protected by RLS. Never add a secret or service-role key to `NEXT_PUBLIC_*` variables.
