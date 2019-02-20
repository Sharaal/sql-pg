Complex queries can be written with normal SQL, including the values needs to be bound and prefixed with the `sql` tag.

# Initialization

```javascript
const sql = require('@sharaal/sql')
```

# Examples

## Values will be automatically extracted and bound

```javascript
const valueA = 'valueA'
const valueB = 'valueB'
const valueC = 'valueC'

const result = client.query(sql`
  SELECT * FROM tableA
    INNER JOIN tableB USING(id)
    WHERE
      columnA = ${valueA}
      AND
      columnB = ${valueB}
      AND
      columnC = ${valueC}
`)
```

Text:

```sql
SELECT * FROM tableA
  INNER JOIN tableB USING(id)
  WHERE
    columnA = $1
    AND
    columnB = $2
    AND
    columnC = $3
```

Parameters:

```javascript
['valueA', 'valueB', 'valueC']
```

## Keys for tables and columns

```javascript
const tableA = 'tableA'
const columns = ['columnA', 'columnB', 'columnC']

const result = client.query(sql`
  SELECT ${sql.keys(columns)} FROM ${sql.key(tableA)}
    INNER JOIN ${sql.key(tableB)} USING(id)
`)
```

Text:

```sql
SELECT "columnA", "columnB", "columnC" FROM "tableA"
  INNER JOIN "tableB" USING(id)
```

Parameters:

```javascript
[]
```

If the `columns` parameter is an object (e.g. a row) the keys of the object will be used.

## Multiple values

```javascript
const values = ['valueA', 'valueB', 'valueC']

const result = client.query(sql`
  INSERT INTO table VALUES (${sql.values(values)})
`)
```

Text:

```sql
INSERT INTO table VALUES ($1, $2, $3)
```

Parameters:

```javascript
['valueA', 'valueB', 'valueC']
```

If the `values` parameter is an object (e.g. a row) the values of the object will be used.

## List of multiple values

```javascript
const values = {
  ['valueA1', 'valueB1', 'valueC1'],
  ['valueA2', 'valueB2', 'valueC2'],
  ['valueA3', 'valueB3', 'valueC3']
}

const result = client.query(sql`
  INSERT INTO table VALUES ${sql.values(values)}
`)
```

Text:

```sql
INSERT INTO table VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)
```

Parameters:

```javascript
['valueA1', 'valueB1', 'valueC1', 'valueA2', 'valueB2', 'valueC2', 'valueA3', 'valueB3', 'valueC3']
```

If the `valuesList` parameter is an array of objects (e.g. list of rows) the values of the objects will be used.

## Pairs of column keys and values using as set of updates

```javascript
const updates = { columnA: 'new valueA', columnB: 'new valueB', columnC: 'new valueC' }

const result = client.query(sql`
  UPDATE table SET ${sql.pairs(updates, ', ')} WHERE value = 'value'
`)
```

Text:

```sql
UPDATE table SET "columnA" = $1, "columnB" = $2, "columnC" = $3 WHERE value = 'value'
```

Parameters:

```javascript
['new valueA', 'new valueB', 'new valueC']
```

## Pairs of column keys and values using as set of conditions

```javascript
const conditions = { columnA: 'old valueA', columnB: 'old valueB', columnC: 'old valueC' }

const result = client.query(sql`
  UPDATE table SET column = 'new value' WHERE ${sql.pairs(conditions, ' AND ')}
`)
```

Text:

```sql
UPDATE table SET column = 'new value' WHERE "columnA" = $1 AND "columnB" = $2 AND "columnC" = $3
```

Parameters:

```javascript
['old valueA', 'old valueB', 'old valueC']
```

# Syntax Highlighting

## Atom

1. Install `language-babel` package
2. In the settings of this package search for "JavaScript Tagged Template Literals Grammar Extensions" and add the support for SQL via `sql:source.sql`
3. If it doesn't work disable "Use Tree Sitter Parsers" in the core settings
