update public.store_settings
set value = '"sphinx2003"'::jsonb, updated_at = now()
where key = 'telegram' and value = '"SPHINX_STORE"'::jsonb;
