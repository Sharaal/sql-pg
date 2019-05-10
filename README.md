[![Build Status](https://travis-ci.org/Sharaal/sql-pg.svg)](https://travis-ci.org/Sharaal/sql-pg) [![Greenkeeper badge](https://badges.greenkeeper.io/Sharaal/sql-pg.svg)](https://greenkeeper.io/)

# Getting Started

## Initialisation

```javascript
const sql = require('sql-pg')
sql.client = client // Assign initialised `pg` client
```

## Usage

### Methods

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

### SQL Tag and Tag Helpers

For all use cases which are not simple CRUD operations, the SQL Tag and Tag Helpers can be used, variables will be exchanged with PostgreSQL placeholders and the values given as parameters.

E.g. list of not activated users filtered by name and with pagination:

```javascript
const name = 'raa'
const page = 0

const users = await sql.query(sql`
  SELECT name, email FROM users
    WHERE
      validated IS NULL
      AND
      name LIKE ${'%' + name + '%'}
    ${sql.pagination(page)}
`)
```

For all details of the methods, the SQL tag and the tag helpers have a look into the [Wiki](https://github.com/Sharaal/sql-pg/wiki).
