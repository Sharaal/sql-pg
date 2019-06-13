[![Build Status](https://travis-ci.org/Sharaal/sql-pg.svg)](https://travis-ci.org/Sharaal/sql-pg)
[![Coverage Status](https://coveralls.io/repos/github/Sharaal/sql-pg/badge.svg?branch=master)](https://coveralls.io/github/Sharaal/sql-pg?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/Sharaal/sql-pg.svg)](https://greenkeeper.io/)

For all details of the methods, the SQL tag and the tag helpers have a look into the [Wiki](https://github.com/Sharaal/sql-pg/wiki).

There is also my blog article [Knex vs alternatives](http://blog.sharaal.de/2019/03/12/knex-vs-alternatives.html) which describes the reasons I started this library.

# Getting Started

## Installation

```bash
npm install --save sql-pg
```

## Initialisation

```javascript
const sql = require('sql-pg')
sql.client = client // Assign initialised `pg` client
```

## Usage

### CRUD Methods

Simple CRUD operations can be done without writing any SQL Statements.

E.g. some user operations:

```javascript
// Insert a user with a name and email
const userId = await sql.insert('users', { name: 'Sharaal', email: 'sql-pg@sharaal.de' })

// Select the user by the ID
const user = (await sql.select('users', { id: userId }))[0]

// Update the user after verified the email validation request
await sql.update('users', { validated: 1 }, { id: userId })

// Delete the user
await sql.delete('users', { id: userId })
```

### Query Methods

Often needed convenient methods to check and extract query results are available with the Query Methods. These are highly inspired by [pg-promise](http://vitaly-t.github.io/pg-promise/index.html).

E.g. some user queries:

```javascript
// Select statements expect to have many or none rows in the result
const users = await sql.any(
  sql`SELECT * FROM users WHERE validated = 1`
)

// Select statements expect to have one row in the result
const user = await sql.one(
  sql`SELECT * FROM users WHERE id = ${userId}`
)
```

There are more Query Methods available and documented in the Wiki.

### SQL Tag and Tag Helpers

For all use cases which are not simple CRUD operations, the SQL Tag and Tag Helpers can be used, variables will be exchanged with PostgreSQL placeholders and the values given as parameters.

E.g. list of not activated users optional filtered by name and with pagination:

```javascript
const name = 'raa'
const page = 0

const users = await sql.query(
  sql`
    SELECT name, email FROM users
      WHERE
        validated IS NULL
        ${sql.if(name, sql`AND name LIKE ${`%${name}%`}`)}
      ${sql.pagination(page)}
  `
)

// text:
//   SELECT name, email FROM users
//     WHERE
//       validated IS NULL
//       AND name LIKE $1
//     LIMIT 10 OFFSET 0
// parameters: ['%raa%']
```

There are more Tag Helpers available and documented in the Wiki.

## Contact

Found a bug or missing a feature? -> Create a new [Issue](https://github.com/Sharaal/sql-pg/issues)

Found a security issue? -> Look at the [Security Policy](https://github.com/Sharaal/sql-pg/security/policy)

Having questions, want to give feedback or talk to me? -> E-Mail me sql-pg@sharaal.de
