DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'gumball_api_reader') THEN
    CREATE ROLE gumball_api_reader NOLOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END
$$;

ALTER ROLE gumball_api_reader SET default_transaction_read_only = on;
ALTER ROLE gumball_api_reader SET statement_timeout = '5s';
ALTER ROLE gumball_api_reader SET idle_in_transaction_session_timeout = '10s';

GRANT USAGE ON SCHEMA public TO gumball_api_reader;
REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated, gumball_api_reader;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated, gumball_api_reader;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated, gumball_api_reader;

ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

CREATE SCHEMA IF NOT EXISTS internal;
REVOKE ALL ON SCHEMA internal FROM PUBLIC, anon, authenticated, gumball_api_reader;

CREATE OR REPLACE FUNCTION internal.apply_public_read_policy(target regclass)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  policy_name text := (SELECT relname FROM pg_catalog.pg_class WHERE oid = target) || '_public_read';
BEGIN
  EXECUTE format('REVOKE ALL ON TABLE %s FROM PUBLIC, anon, authenticated, gumball_api_reader', target);
  EXECUTE format('GRANT SELECT ON TABLE %s TO anon, authenticated, gumball_api_reader', target);
  EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', target);
  EXECUTE format('DROP POLICY IF EXISTS %I ON %s', policy_name, target);
  EXECUTE format('CREATE POLICY %I ON %s AS PERMISSIVE FOR SELECT TO anon, authenticated, gumball_api_reader USING (true)', policy_name, target);
END;
$$;

REVOKE ALL ON FUNCTION internal.apply_public_read_policy(regclass) FROM PUBLIC, anon, authenticated, gumball_api_reader;
