[![Build Status](https://travis-ci.org/Sharaal/sql-pg.svg)](https://travis-ci.org/Sharaal/sql-pg)
[![Coverage Status](https://coveralls.io/repos/github/Sharaal/sql-pg/badge.svg?branch=master)](https://coveralls.io/github/Sharaal/sql-pg?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/Sharaal/sql-pg.svg)](https://greenkeeper.io/)

Latest Release: ..., Latest Major Release: ..., [All Releases](...)

# SQL-PG

Complex queries can be written with normal SQL, including the values needs to be bound and prefixed with the sql tag.

<table>
  <tr>
    <td><img alt="SQL" src="https://github.com/sharaal/sql-pg/raw/master/docs/sql.png"></td>
    <td>Make the name variable?</td>
    <td><img alt="SQL" src="https://github.com/sharaal/sql-pg/raw/master/docs/sql-pg.png"></td>
  </tr>
  <tr>
    <td></td>
    <td>Or even more simple?</td>
    <td><img alt="SQL" src="https://github.com/sharaal/sql-pg/raw/master/docs/selection-method.png"></td>
  </tr>
</table>

## Features

* Built on top of `pg` as database driver
* Simple data manipulation and selection methods without the need to write SQL
* SQL Tag and Tag Helpers to write queries looks like native SQL and be secure by design
* Write easy unit testable queries
* Possibility to add own Tag Helpers to extend the functionality

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
const id = await sql.insert(
  'users',
  { name: 'Sharaal', email: 'sql-pg@sharaal.de' }
)

await sql.update('users', { validated: 1 }, { id })

await sql.delete('users', { id })
```

More complex data manipulation can be done with the SQL Tag.

### Selection Methods

Often needed convenient methods to check and extract query results are available with the Selection Methods.

E.g. select all not validated users:

```javascript
const users = await sql.any('users', ['name', 'email'], { validated: 0 })
```

Also the Selection Methods supports SQL Tag as parameter for more complex selections. Because they are highly inspired by `pg-promise`, there are the Selection Methods `any`/`manyOrNone`, `many`, `oneOrNone` and `one` available.

### SQL Tag and Tag Helpers

If it becomes more complex the SQL Tag and Tag Helpers are the way to go.

They are as near as possible to native SQL queries to be readable and easy to write. All variables can be directly used and will be exchanged via placeholders and given to the database separately as parameters. For non native values like lists, for table/column names and conditions there are Tag Helpers.

E.g. list of not activated users filtered by name and with pagination:

```javascript
const name = 'raa'

const users = await sql.any(
  sql`
    SELECT "name", "email" FROM "users"
      WHERE
        "validated" = 0
        AND
        "name" LIKE ${`%${name}%`}
  `
)
```

There are a lot more Tag Helpers available like `.table`, `.column(s)`, `.value(s)`, `.valuesList`, `.assignments`, `.conditions`, `.limit`, `.offset`, `.pagination` and `.if`.

## More

Available Tag Helpers, Nested Queries, Transaction, Writing Tag Helpers, Migrations, Syntax Highlighting in Atom... All additional documentation can be found in the [Wiki](https://github.com/Sharaal/sql-pg/wiki).

## Contact

Found a bug or missing a feature? -> Create a new [Issue](https://github.com/Sharaal/sql-pg/issues)

Found a security issue? -> Look at the [Security Policy](https://github.com/Sharaal/sql-pg/security/policy)

Having questions, want to give feedback or talk to me? -> E-Mail me sql-pg@sharaal.de
