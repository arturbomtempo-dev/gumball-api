import 'dotenv/config';
import pg from 'pg';

const API_ROLE = 'gumball_api_reader';
const PUBLIC_ROLES = ['anon', 'authenticated', API_ROLE];
const WRITE_PRIVILEGES = ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'];
const SMOKE_TABLE = 'public.__security_smoke_test';

interface CheckResult {
    name: string;
    passed: boolean;
    details?: string;
}

const results: CheckResult[] = [];

function record(name: string, passed: boolean, details?: string): void {
    results.push({ name, passed, details });
}

function createClient(connectionString: string): pg.Client {
    const certificateAuthority = process.env['DATABASE_SSL_CA'];

    return new pg.Client({
        connectionString,
        ssl: certificateAuthority
            ? {
                  ca: certificateAuthority.replace(/\\n/g, '\n'),
                  rejectUnauthorized: true,
              }
            : undefined,
    });
}

async function expectFailure(client: pg.Client, sql: string): Promise<string | null> {
    await client.query('SAVEPOINT attempt');

    try {
        await client.query(sql);
        await client.query('RELEASE SAVEPOINT attempt');
        return null;
    } catch (error) {
        await client.query('ROLLBACK TO SAVEPOINT attempt');
        return error instanceof Error ? error.message : String(error);
    }
}

async function auditCatalog(admin: pg.Client): Promise<void> {
    const role = await admin.query<{
        rolcanlogin: boolean;
        rolsuper: boolean;
        rolbypassrls: boolean;
        rolconfig: string[] | null;
    }>('SELECT rolcanlogin, rolsuper, rolbypassrls, rolconfig FROM pg_roles WHERE rolname = $1', [
        API_ROLE,
    ]);
    const apiRole = role.rows[0];

    record(`${API_ROLE} role exists`, Boolean(apiRole));

    if (apiRole) {
        record(
            `${API_ROLE} is not superuser and cannot bypass RLS`,
            !apiRole.rolsuper && !apiRole.rolbypassrls
        );
        record(
            `${API_ROLE} runs every transaction as read-only`,
            apiRole.rolconfig?.includes('default_transaction_read_only=on') ?? false
        );
        record(
            `${API_ROLE} can log in`,
            apiRole.rolcanlogin,
            apiRole.rolcanlogin ? undefined : 'run supabase/sql/enable-api-reader-login.sql'
        );
    }

    const tablesWithoutRls = await admin.query<{ table_name: string }>(`
    SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') AND NOT c.relrowsecurity
  `);
    record(
        'every table in public has RLS enabled',
        tablesWithoutRls.rowCount === 0,
        tablesWithoutRls.rows.map((row) => row.table_name).join(', ')
    );

    const nonSelectPolicies = await admin.query<{
        tablename: string;
        policyname: string;
        cmd: string;
    }>(`
    SELECT tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public' AND cmd <> 'SELECT'
  `);
    record(
        'public tables only have SELECT policies',
        nonSelectPolicies.rowCount === 0,
        nonSelectPolicies.rows
            .map((row) => `${row.tablename}.${row.policyname} (${row.cmd})`)
            .join(', ')
    );

    const writeGrants = await admin.query<{
        role_name: string;
        table_name: string;
        privilege: string;
    }>(
        `
    SELECT r.role_name, c.relname AS table_name, p.privilege
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    CROSS JOIN unnest($1::text[]) AS r(role_name)
    CROSS JOIN unnest($2::text[]) AS p(privilege)
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p', 'v', 'm')
      AND has_table_privilege(r.role_name, c.oid, p.privilege)
  `,
        [PUBLIC_ROLES, WRITE_PRIVILEGES]
    );
    record(
        'public roles have no write privileges on any table',
        writeGrants.rowCount === 0,
        writeGrants.rows
            .map((row) => `${row.role_name}: ${row.privilege} on ${row.table_name}`)
            .join(', ')
    );

    const migrationsAccess = await admin.query<{ role_name: string }>(
        `
    SELECT r.role_name
    FROM unnest($1::text[]) AS r(role_name)
    WHERE has_table_privilege(r.role_name, 'public._prisma_migrations', 'SELECT')
  `,
        [PUBLIC_ROLES]
    );
    record(
        'migration history is hidden from public roles',
        migrationsAccess.rowCount === 0,
        migrationsAccess.rows.map((row) => row.role_name).join(', ')
    );

    const schemaAccess = await admin.query<{ role_name: string; issue: string }>(
        `
    SELECT r.role_name, 'CREATE on public' AS issue
    FROM unnest($1::text[]) AS r(role_name)
    WHERE has_schema_privilege(r.role_name, 'public', 'CREATE')
    UNION ALL
    SELECT r.role_name, 'USAGE on internal' AS issue
    FROM unnest($1::text[]) AS r(role_name)
    WHERE has_schema_privilege(r.role_name, 'internal', 'USAGE')
  `,
        [PUBLIC_ROLES]
    );
    record(
        'public roles cannot create objects or reach the internal schema',
        schemaAccess.rowCount === 0,
        schemaAccess.rows.map((row) => `${row.role_name}: ${row.issue}`).join(', ')
    );
}

async function smokeTestPublicRoles(admin: pg.Client): Promise<void> {
    await admin.query('BEGIN');

    try {
        await admin.query(
            `CREATE TABLE ${SMOKE_TABLE} (id integer PRIMARY KEY, name text NOT NULL)`
        );
        await admin.query(`INSERT INTO ${SMOKE_TABLE} VALUES (1, 'visible')`);
        await admin.query(`SELECT internal.apply_public_read_policy('${SMOKE_TABLE}')`);

        for (const role of ['anon', 'authenticated']) {
            await admin.query(`SET LOCAL ROLE ${role}`);

            const visible = await admin.query(`SELECT * FROM ${SMOKE_TABLE}`);
            record(`${role} can read rows`, visible.rowCount === 1);

            const attempts = {
                INSERT: `INSERT INTO ${SMOKE_TABLE} VALUES (2, 'forbidden')`,
                UPDATE: `UPDATE ${SMOKE_TABLE} SET name = 'forbidden'`,
                DELETE: `DELETE FROM ${SMOKE_TABLE}`,
                TRUNCATE: `TRUNCATE ${SMOKE_TABLE}`,
                'CREATE TABLE': 'CREATE TABLE public.__forbidden (id integer)',
            };

            for (const [operation, sql] of Object.entries(attempts)) {
                const error = await expectFailure(admin, sql);
                record(
                    `${role} cannot ${operation}`,
                    error !== null,
                    error ?? 'operation succeeded'
                );
            }

            await admin.query('RESET ROLE');
        }
    } finally {
        await admin.query('ROLLBACK');
    }
}

async function smokeTestApiRole(databaseUrl: string): Promise<void> {
    const reader = createClient(databaseUrl);
    await reader.connect();

    try {
        const identity = await reader.query<{ current_user: string }>('SELECT current_user');
        record(
            `DATABASE_URL connects as ${API_ROLE}`,
            identity.rows[0]?.current_user === API_ROLE,
            identity.rows[0]?.current_user
        );

        await reader.query('SET default_transaction_read_only = off');
        await reader.query('BEGIN');

        const attempts = {
            'write to migration history': `INSERT INTO public._prisma_migrations (id, checksum, migration_name) VALUES ('x', 'x', 'x')`,
            'create tables': 'CREATE TABLE public.__forbidden (id integer)',
            'switch to a privileged role': 'SET ROLE postgres',
            'call internal functions': `SELECT internal.apply_public_read_policy('public._prisma_migrations')`,
        };

        for (const [operation, sql] of Object.entries(attempts)) {
            const error = await expectFailure(reader, sql);
            record(
                `${API_ROLE} cannot ${operation}, even with read-only mode disabled`,
                error !== null,
                error ?? 'operation succeeded'
            );
        }

        await reader.query('ROLLBACK');
    } finally {
        await reader.end();
    }
}

async function main(): Promise<void> {
    const migrationUrl = process.env['DATABASE_MIGRATION_URL'];
    const databaseUrl = process.env['DATABASE_URL'];

    if (!migrationUrl) {
        throw new Error('DATABASE_MIGRATION_URL is required');
    }

    const admin = createClient(migrationUrl);
    await admin.connect();

    try {
        await auditCatalog(admin);
        await smokeTestPublicRoles(admin);
    } finally {
        await admin.end();
    }

    if (databaseUrl) {
        await smokeTestApiRole(databaseUrl);
    } else {
        record('DATABASE_URL is set', false, 'API role was not tested');
    }

    for (const result of results) {
        const icon = result.passed ? '✔' : '✘';
        const details = !result.passed && result.details ? `  →  ${result.details}` : '';
        console.log(`${icon} ${result.name}${details}`);
    }

    const failures = results.filter((result) => !result.passed).length;
    console.log(`\n${results.length - failures} passed, ${failures} failed`);

    if (failures > 0) {
        process.exitCode = 1;
    }
}

await main();
