Complex queries can be written with normal SQL, including the values needs to be bound and prefixed with the `sql` tag.

# Initialization

```javascript
const sql = require('@sharaal/sql-pg')
```

# Examples

## Extract and bind values

```javascript
const email = 'email'
const passwordhash = 'passwordhash'

const result = await client.query(sql`
  SELECT * FROM users WHERE email = ${email} AND passwordhash = ${passwordhash}
`)

// text: SELECT * FROM users WHERE email = $1 AND passwordhash = $2
// parameters: ['email', 'passwordhash']
```

## Escape keys for tables and columns

```javascript
const table = 'users'
const columns = ['id', 'email']

const result = await client.query(sql`
  SELECT ${sql.keys(columns)} FROM ${sql.key(table)}
`)

// text: SELECT "id", "email" FROM "users"
// parameters: []
```

If the `columns` parameter is an object (e.g. a row) the keys of the object will be used.

## Extract and bind list of values

```javascript

const values = ['email', 'passwordhash']

const result = await client.query(sql`
  INSERT INTO users (email, passwordhash) VALUES (${sql.values(values)})
`)

// text: INSERT INTO users (email, passwordhash) VALUES ($1, $2)
// parameters: ['email', 'passwordhash']
```

If the `values` parameter is an object (e.g. a row) the values of the object will be used.

## Extract and bind multiple value lists

```javascript
const valuesList = [
  ['emailA', 'passwordhashA'],
  ['emailB', 'passwordhashB']
]

const result = await client.query(sql`
  INSERT INTO users VALUES ${sql.values(valuesList)}
`)

// text: INSERT INTO users VALUES ($1, $2), ($3, $4)
// parameters: ['emailA', 'passwordhashA', 'emailB', 'passwordhashB']
```

If the `valuesList` parameter is an array of objects (e.g. list of rows) the values of the objects will be used.

## Support pairs of column keys and values using as set of updates

```javascript
const user = { email: 'email', passwordhash: 'passwordhash' }

const result = await client.query(sql`
  UPDATE users SET ${sql.pairs(user, ', ')} WHERE id = 'id'
`)

// text: UPDATE users SET "email" = $1, "passwordhash" = $2 WHERE id = 'id'
// parameters: ['email', 'passwordhash']
```

## Support pairs of column keys and values using as set of conditions

```javascript
const user = { email: 'email', passwordhash: 'passwordhash' }

const result = await client.query(sql`
  SELECT * FROM users WHERE ${sql.pairs(user, ' AND ')}
`)

// text: SELECT * FROM users WHERE "email" = $1 AND "passwordhash" = $2
// parameters: ['email', 'passwordhash']
```

# Support for nested queries

```javascript
const state = 'active'
const email = 'email'
const passwordhash = 'passwordhash'

const result = await client.query(sql`
  SELECT * FROM users WHERE
    state = ${state}
    AND
    id = (${sql`SELECT id FROM users WHERE email = ${email} AND passwordhash = ${passwordhash}`})
`)

// text: SELECT * FROM users WHERE
//         state = $1
//         AND
//         id = (SELECT id FROM users WHERE email = $2 AND passwordhash = $3)
// parameters: ['active', 'email', 'passwordhash']
```

# Syntax Highlighting

## Atom

1. Install `language-babel` package
2. In the settings of this package search for "JavaScript Tagged Template Literals Grammar Extensions" and add the support for SQL via `sql:source.sql`
3. If it doesn't work disable "Use Tree Sitter Parsers" in the core settings

# Known issues

:warning: PostgreSQL use numbered `$` in the SQL text to bind values. Because of this `$` is reserved and can't be used in text fragments. If you need this you can bind them as value.

```javascript
// bad
const result = await client.query(sql`SELECT * FROM users WHERE email = "$"`)

// text: SELECT * FROM users WHERE email = "$1"
// parameters: []

// good
const result = await client.query(sql`SELECT * FROM users WHERE email = ${'$'}`)

// text: SELECT * FROM users WHERE email = $1
// parameters: ['$']
```
