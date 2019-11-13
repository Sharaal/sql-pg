module.exports = sql => {
  sql.deleteAll = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const [table, conditions] = params
      params = [sql`DELETE FROM ${sql.table(table)}${sql.if(conditions, sql` WHERE ${sql.conditions(conditions)}`)}`]
    }
    const [query] = params
    const result = await sql.query(query)
    return result.rowCount
  }
}
