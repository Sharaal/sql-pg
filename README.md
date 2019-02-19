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

client.query(sql`
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

## Identifiers for tables and columns needs to be defined

```javascript
const tableA = 'tableA'
const columns = ['columnA', 'columnB', 'columnC']

client.query(sql`
  SELECT ${sql.identifiers(columns)} FROM ${sql.identifier(tableA)}
    INNER JOIN ${sql.identifier(tableB)} USING(id)
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

## List of values can also be defined

```javascript
const values = ['valueA', 'valueB', 'valueC']

client.query(sql`
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

## Also pairs of column identifiers and values can be defined using as set of updates

```javascript
const updates = { columnA: 'new valueA', columnB: 'new valueB', columnC: 'new valueC' }

client.query(sql`
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

## Also pairs of column identifiers and values can be defined using as set of conditions

```javascript
const conditions = { columnA: 'old valueA', columnB: 'old valueB', columnC: 'old valueC' }

client.query(sql`
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
