-- ................
--
-- Stripe Wrappers
--
-- ................
create extension if not exists wrappers
with
    schema extensions;

create foreign data wrapper stripe_wrapper handler stripe_fdw_handler validator stripe_fdw_validator;

do $$
declare
  v_key_id uuid;
  v_sql text;
begin
    -- Save your Stripe API key in Vault and retrieve the `key_id`
    insert into vault.secrets (name, secret)
    values (
    'stripe',
    'sk_test_51P8D3YFdTEbLVdo4x8NfIangayI1FL3KLetMuWUAHceQH2bTI7iWZyS6q2hcjbVUo4UcpY9bijohQzf1x3apfDux00VvsGZlH6'
    )
    returning key_id into v_key_id;

    -- Construct the dynamic SQL statement
    v_sql := format('create server stripe_server foreign data wrapper stripe_wrapper options (api_key_id ''%s'', api_url ''https://api.stripe.com/v1/'')', v_key_id);

    -- Execute the dynamic SQL
    execute v_sql;
 end $$;

create schema stripe;

create foreign table stripe.customers (
    id text,
    email text,
    name text,
    description text,
    created timestamp,
    attrs jsonb
) server stripe_server options (object 'customers', rowid_column 'id');

create foreign table stripe.products (
    id text,
    name text,
    active bool,
    default_price text,
    description text,
    created timestamp,
    updated timestamp,
    attrs jsonb
) server stripe_server options (object 'products', rowid_column 'id');

create foreign table stripe.prices (
    id text,
    active bool,
    currency text,
    product text,
    unit_amount bigint,
    type text,
    created timestamp,
    attrs jsonb
) server stripe_server options (object 'prices', rowid_column 'id');

-- create or replace function public.create_stripe_product_for_event () returns trigger as $$
-- declare
--   v_price_id text;
-- begin
--   -- Insert into stripe.products
--   if not exists (select 1 from stripe.products where id = 'prod_' || new.id) then
--     insert into stripe.products (id, name, active)
--     values (
--       'prod_' || new.id,
--       new.name, 
--       new.status = 'reserving'
--     );

--     insert into stripe.prices (product, active, currency, unit_amount)
--     values (
--       'prod_' || new.id, 
--       new.status = 'reserving', 
--       new.price_currency, 
--       new.price * 100
--     );

--     -- Retrieve the price ID from stripe.prices
--     select id into v_price_id
--     from stripe.prices
--     where product = 'prod_' || new.id
--     order by created desc
--     limit 1;

--     -- Update public.events with the captured price_stripe_id
--     update public.events
--     set price_stripe_id = v_price_id
--     where id = new.id;
--   end if;

--   return new;
-- end;
-- $$ language plpgsql;

-- create trigger trigger_create_stripe_product_after_event_creation
-- after insert on public.events for each row
-- execute function public.create_stripe_product_for_event ();
