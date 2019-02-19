Complex queries can be written with normal SQL, including the values needs to be bound and prefixed with the `sql` tag.

# Initialization

```javascript
const sql = require('@sharaal/sql')
```

# Examples

```javascript
const value = 'value'
client.query(sql`SELECT * FROM tableA INNER JOIN tableB USING(column) WHERE column = ${value}`)
// text: SELECT * FROM tableA INNER JOIN tableB USING(column) WHERE column = $1
// parameters: ['value']
```

# Syntax Highlighting

## Atom

1. Install `language-babel` package
2. In the settings of this package search for "JavaScript Tagged Template Literals Grammar Extensions" and add the support for SQL via `sql:source.sql`
3. If it doesn't work disable "Use Tree Sitter Parsers" in the core settings
