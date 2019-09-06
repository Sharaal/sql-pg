#!/usr/bin/env node

let debug
try {
  debug = require('debug')('migrate')
} catch (e) {
  debug = console.log
}

const fs = require('fs')
const path = require('path')

;(async () => {
  debug('starting migrations')
  let client
  const clientPath = path.join(process.cwd(), 'pg.js')
  if (fs.fileExistsSync(clientPath)) {
    debug('use the projects `pg.js` to connect to the database')
    client = require(clientPath)
  } else {
    debug('use "process.env.DATABASE_URL" to connect to the database')
    const { Client } = require('pg')
    client = new Client({ connectionString: process.env.DATABASE_URL })
  }
  await client.connect()

  const sql = require('../')({ client })

  debug('create columns helper for "id", "created_at" and "updated_at"')
  const columns = {
    id: sql`${sql.column('id')} SERIAL NOT NULL PRIMARY KEY`,
    created_at: sql`${sql.column('created_at')} TIMESTAMPTZ NOT NULL DEFAULT NOW()`,
    updated_at: sql`${sql.column('updated_at')} TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  }

  debug('create trigger function and trigger assign helper for "updated_at"')
  await sql.query(sql`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)
  const updatedAt = table => sql`
    CREATE TRIGGER ${sql.table(`set_timestamp_${table}`)}
    BEFORE UPDATE ON ${sql.table(table)}
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `

  debug('create table "migrations" if not exists')
  await sql.query(sql`
    CREATE TABLE IF NOT EXISTS migrations (
      ${columns.id},
      ${columns.created_at},
      ${columns.updated_at},
      file VARCHAR(255) PRIMARY KEY
    )
  `)
  await sql.query(updatedAt('migrations'))

  debug('select already processed migrations:')
  const processed = await sql.any('migrations', ['file'])
    .map(({ file }) => file)
  debug('%o', processed)

  debug('read directory, filter and sort migrations:')
  const directory = path.join(process.cwd(), 'migrations')

  const migrations = fs.readdirSync(directory)
    .filter(file => (file.endsWith('.js') || file.endsWith('.sql')) && !processed.includes(file))
    .sort((fileA, fileB) => parseInt(fileA, 10) - parseInt(fileB, 10))
  debug('%o', migrations)

  if (migrations.length === 0) {
    debug('no unprocessed migrations found, database already up to date')
  } else {
    for (const file of migrations) {
      debug('process migration file: "%s"', file)
      try {
        await sql.transaction(async () => {
          if (file.endsWith('.js')) {
            await require(path.join(directory, file))(sql, { columns, updatedAt })
          }
          if (file.endsWith('.sql')) {
            await client.query(fs.readFileSync(path.join(directory, file)).toString())
          }
          await sql.insert('migrations', { file })
        })
        debug('file successfully processed')
      } catch (e) {
        debug('error: "%s"', e.message)
        throw e
      }
    }
    debug('all migrations successfully processed')
  }

  await client.end()
})()
