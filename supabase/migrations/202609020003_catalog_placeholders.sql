drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories"
on public.categories for select to anon, authenticated
using (true);
