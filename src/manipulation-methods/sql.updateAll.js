module.exports = sql => {
  sql.updateAll = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const [table, updates, conditions] = params
      params = [sql`UPDATE ${sql.table(table)} SET ${sql.assignments(updates)}${sql.if(conditions, sql` WHERE ${sql.conditions(conditions)}`)}`]
    }
    const [query] = params
    const result = await sql.query(query)
    return result.rowCount
  }
}
