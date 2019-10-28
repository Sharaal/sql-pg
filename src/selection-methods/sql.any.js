module.exports = sql => {
  sql.any = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const table = params[0]
      let columns
      if (Array.isArray(params[1])) {
        columns = params[1]
      }
      let conditions
      if (typeof params[1] === 'object' && !Array.isArray(params[1])) {
        conditions = params[1]
      }
      if (params[2]) {
        conditions = params[2]
      }
      params = [sql`SELECT ${columns ? sql.columns(columns) : () => ({ text: '*', values: [] })} FROM ${sql.table(table)}${sql.if(conditions, sql` WHERE ${sql.conditions(conditions)}`)}`]
    }
    const [query] = params
    const result = await sql.query(query)
    return result.rows
  }
}
