[![Build Status](https://travis-ci.org/Sharaal/sql-pg.svg)](https://travis-ci.org/Sharaal/sql-pg)
[![Coverage Status](https://coveralls.io/repos/github/Sharaal/sql-pg/badge.svg?branch=master)](https://coveralls.io/github/Sharaal/sql-pg?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/Sharaal/sql-pg.svg)](https://greenkeeper.io/)

For all details of the Manipulation Methods, Selection Methods, SQL Tag and Tag Helpers have a look into the [Wiki](https://github.com/Sharaal/sql-pg/wiki).

There is also my blog article [Knex vs alternatives](http://blog.sharaal.de/2019/03/12/knex-vs-alternatives.html) which describes why I started to develop this library.

# Getting Started

## Installation

```bash
npm install --save sql-pg
```

## Initialisation

```javascript
const sql = require('sql-pg')({ client })
```

## Usage

### Manipulation Methods

Simple data manipulation can be done without writing any SQL Statements.

E.g. some user data manipulation:

```javascript
const id = await sql.insert('users', { name: 'Sharaal', email: 'sql-pg@sharaal.de' })

await sql.update('users', { validated: 1 }, { id })

await sql.delete('users', { id })
```

More complex data manipulation can be done with the SQL Tag.

For all details of `insert`, `update` and `delete` have a look into the Wiki, starting with [Wiki -> Insert](https://github.com/Sharaal/sql-pg/wiki/Insert).

### Selection Methods

Often needed convenient methods to check and extract query results are available with the Selection Methods. They are highly inspired by [pg-promise](http://vitaly-t.github.io/pg-promise/index.html).

E.g. select the inserted user:

```javascript
const user = await sql.one('users', { id })
```

Also the Selection Methods supports SQL Tag as parameter for more complex selections.

For all details of `any`/`manyOrNone`, `many`, `oneOrNone` and `one` have a look into the [Wiki -> Selection Methods](https://github.com/Sharaal/sql-pg/wiki/Selection-Methods).

### SQL Tag and Tag Helpers

If it becomes more complex the SQL Tag and Tag Helpers are the way to go.

They are as near as possible to native SQL queries to be readable and easy to write. All variables can be directly used and will be exchanged via placeholders and given to the database separately as parameters. For non native values like lists, for table/column names and conditions there are Tag Helpers.

E.g. list of not activated users optional filtered by name and with pagination:

```javascript
const name = 'raa'
const page = 0

const users = await sql.any(
  sql`
    SELECT "name", "email" FROM "users"
      WHERE
        "validated" = 0
        ${sql.if(name, sql`AND "name" LIKE ${`%${name}%`}`)}
      ${sql.pagination(page)}
  `
)
```

There are a lot more Tag Helpers available and documented in the Wiki, starting with [Wiki -> Table](https://github.com/Sharaal/sql-pg/wiki/Table).

Also own Tag Helpers can be written easily to extend the possibilities the library provide. Details for these can be found also in the [Wiki -> Writing Tag Helpers](https://github.com/Sharaal/sql-pg/wiki/Writing-Tag-Helpers).

## Transaction

If there is the need to run several queries in one transaction there is the `transaction` method available which envelopes the queries with the `BEGIN` and `COMMIT` (if all was successful) or `ROLLBACK` (if there was an error).

E.g. create user and add an audit log entry:

```javascript
await sql.transaction(async () => {
  const id = await sql.insert(
    'users',
    { name: 'Sharaal', email: 'sql-pg@sharaal.de' }
  )
  await sql.insert('audits', { action: 'USER_CREATED', id })
})
```

## Query

For all remaining use cases (e.g. change database schema or grant access) there is a `query` method which is similar to the method of [pg](https://node-postgres.com/), except it only accepts queries created with the SQL Tag.

E.g. create the users table used in the examples:

```javascript
await sql.query(
  sql`
    CREATE TABLE "users" {
      "id" serial PRIMARY KEY,
      "name" VARCHAR (255) NOT NULL,
      "email" VARCHAR (255) UNIQUE NOT NULL,
      "password" CHAR (60),
      "validated" BOOLEAN DEFAULT 0
    }
  `
)
```

## Migrations

There is also a migrations support to ensure the database is always in the latest schema in all environments. To use this it's needed to create migration files and executing the `migrate` command on every deploy.

Details for these can be found also in the [Wiki -> Migrations](https://github.com/Sharaal/sql-pg/wiki/Migrations).

## Contact

Found a bug or missing a feature? -> Create a new [Issue](https://github.com/Sharaal/sql-pg/issues)

Found a security issue? -> Look at the [Security Policy](https://github.com/Sharaal/sql-pg/security/policy)

Having questions, want to give feedback or talk to me? -> E-Mail me sql-pg@sharaal.de
