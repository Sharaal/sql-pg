[![Build Status](https://travis-ci.org/Sharaal/sql-pg.svg)](https://travis-ci.org/Sharaal/sql-pg)
[![Coverage Status](https://coveralls.io/repos/github/Sharaal/sql-pg/badge.svg?branch=master)](https://coveralls.io/github/Sharaal/sql-pg?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/Sharaal/sql-pg.svg)](https://greenkeeper.io/)

For all details of CRUD Methods, Select Methods, SQL Tag and Tag Helpers have a look into the [Wiki](https://github.com/Sharaal/sql-pg/wiki).

There is also my blog article [Knex vs alternatives](http://blog.sharaal.de/2019/03/12/knex-vs-alternatives.html) which describes the reasons why I started this library.

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

More complex CRUD can be done with the SQL Tag.

For all details have a look into the Wiki, starting with [Wiki -> Insert](https://github.com/Sharaal/sql-pg/wiki/Insert).

### Query Methods

Often needed convenient methods to check and extract query results are available with the Query Methods. These are highly inspired by [pg-promise](http://vitaly-t.github.io/pg-promise/index.html).

E.g. select the inserted user:

```javascript
const user = await sql.one('users', { id })
```

Also the Query Methods supports SQL Tag as parameter for more complex selections.

The other Query Methods `any`/`manyOrNone`, `many`, `oneOrNone` and `one` are documented in the [Wiki -> Query Methods](https://github.com/Sharaal/sql-pg/wiki/Query-Methods).

### SQL Tag and Tag Helpers

If it becomes more complex the SQL Tag and Tag Helpers are the way to go.

They are as near as possible to native SQL queries to be readable and easy to write. All variables can be directly used and will be exchanged via placeholders and given to the database separately as parameters. For non native values like lists, for table/column names and conditions there are Tag Helpers.

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

Also own Tag Helpers can be written easily to extend the possibilities the library provide. Details for these can be found also in the [Wiki -> Writing Tag Helpers](https://github.com/Sharaal/sql-pg/wiki/Writing-Tag-Helpers).

## Contact

Found a bug or missing a feature? -> Create a new [Issue](https://github.com/Sharaal/sql-pg/issues)

Found a security issue? -> Look at the [Security Policy](https://github.com/Sharaal/sql-pg/security/policy)

Having questions, want to give feedback or talk to me? -> E-Mail me sql-pg@sharaal.de
