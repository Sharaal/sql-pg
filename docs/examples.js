sql`

  SELECT "name", "email"
  FROM "users"
  WHERE "id" = 1

`

  sql`
    SELECT "name", "email"
    FROM "users"
    WHERE "id" = ${id}
  `

  sql.one('users', { id })
