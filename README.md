[![Build Status](https://travis-ci.org/Sharaal/sql-pg.svg)](https://travis-ci.org/Sharaal/sql-pg)
[![Coverage Status](https://coveralls.io/repos/github/Sharaal/sql-pg/badge.svg?branch=master)](https://coveralls.io/github/Sharaal/sql-pg?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/Sharaal/sql-pg.svg)](https://greenkeeper.io/)

For all details of CRUD Methods, Select Methods, SQL Tag and Tag Helpers have a look into the [Wiki](https://github.com/Sharaal/sql-pg/wiki).

There is also my blog article [Knex vs alternatives](http://blog.sharaal.de/2019/03/12/knex-vs-alternatives.html) which describes the reasons I started this library.

# Getting Started

## Installation

```bash
npm install --save sql-pg
```

## Initialisation

```javascript
const sql = require('sql-pg')
sql.client = client
```

## Usage

### CRUD Methods

Simple CRUD can be done without writing any SQL Statements.

E.g. some user operations:

```javascript
const id = await sql.insert('users', { name: 'Sharaal', email: 'sql-pg@sharaal.de' })

await sql.update('users', { validated: 1 }, { id })

await sql.delete('users', { id })
```

There is also the opportunity to use the CRUD Methods with the SQL Tag, for the details have a look into the Wiki, starting with [Wiki -> Insert](https://github.com/Sharaal/sql-pg/wiki/Insert).

### Query Methods

Often needed convenient methods to check and extract query results are available with the Query Methods. These are highly inspired by [pg-promise](http://vitaly-t.github.io/pg-promise/index.html).

E.g. select the inserted user:

```javascript
const user = await sql.one('users', { id })
```

The other Query Methods `any`/`manyOrNone`, `many`, `oneOrNone` and `one` are documented in the [Wiki -> Query Methods](https://github.com/Sharaal/sql-pg/wiki/Query-Methods).

### SQL Tag and Tag Helpers

For all use cases which are not simple CRUD operations, the SQL Tag and Tag Helpers can be used, variables will be exchanged with PostgreSQL placeholders and the values given as parameters.

E.g. list of not activated users optional filtered by name and with pagination:

```javascript
const name = 'raa'
const page = 0

const users = await sql.any(
  sql`
    SELECT name, email FROM users
      WHERE
        validated IS NULL
        ${sql.if(name, sql`AND name LIKE ${`%${name}%`}`)}
      ${sql.pagination(page)}
  `
)
```

There are a lot more Tag Helpers available and documented in the Wiki, starting with [Wiki -> Key(s)](https://github.com/Sharaal/sql-pg/wiki/Key%28s%29).

## Contact

Found a bug or missing a feature? -> Create a new [Issue](https://github.com/Sharaal/sql-pg/issues)

Found a security issue? -> Look at the [Security Policy](https://github.com/Sharaal/sql-pg/security/policy)

Having questions, want to give feedback or talk to me? -> E-Mail me sql-pg@sharaal.de
