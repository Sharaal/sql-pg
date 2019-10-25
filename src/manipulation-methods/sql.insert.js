module.exports = sql => {
  sql.defaultSerialColumn = sql.defaultSerialColumn || 'id'

  sql.insert = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      let [table, rows, { columns, serialColumn = sql.defaultSerialColumn } = {}] = params
      let array = true
      if (!Array.isArray(rows)) {
        rows = [rows]
        array = false
      }
      if (!columns) {
        columns = Object.keys(rows[0])
      }
      const result = await sql.query(sql`INSERT INTO ${sql.table(table)} (${sql.columns(columns)}) VALUES ${sql.valuesList(rows, { columns })} RETURNING ${sql.column(serialColumn)}`)
      if (!array) {
        return result.rows[0][serialColumn]
      }
      return result.rows.map(row => row[serialColumn])
    }
    const [query, { serialColumn = sql.defaultSerialColumn } = {}] = params
    const result = await sql.query(query)
    return result.rows.map(row => row[serialColumn])
  }
}
