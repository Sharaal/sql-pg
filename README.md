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
