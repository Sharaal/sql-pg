module.exports = async (sql, { columns, updatedAt }) => {
  await sql.query(sql`
    CREATE TABLE IF NOT EXISTS "users" (
      ${columns.id},
      ${columns.created_at},
      ${columns.updated_at},
      "name" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "passwordhash" VARCHAR(255) NOT NULL,
      "validated" INT
    )
  `)
  await sql.query(updatedAt('users'))
}
