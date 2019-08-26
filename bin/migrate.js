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

  debug('create table "migrations" if not exists')
  await client.query('CREATE TABLE IF NOT EXISTS migrations (file VARCHAR(255) PRIMARY KEY)')

  debug('select already processed migrations:')
  const processed = (await client.query('SELECT * FROM migrations')).rows
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
        await client.query('BEGIN')
        if (file.endsWith('.js')) {
          await require(path.join(directory, file))(client)
        }
        if (file.endsWith('.sql')) {
          await client.query(fs.readFileSync(path.join(directory, file)).toString())
        }
        await client.query('INSERT INTO migrations (file) VALUES ($1)', [file])
        await client.query('COMMIT')
        debug('file successfully processed')
      } catch (e) {
        await client.query('ROLLBACK')
        debug('error: "%s"', e.message)
        throw e
      }
    }
    debug('all migrations successfully processed')
  }

  await client.end()
})()
