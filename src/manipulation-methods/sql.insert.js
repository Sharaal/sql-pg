module.exports = sql => {
  sql.defaultSerialColumn = sql.defaultSerialColumn || 'id'

  sql.insert = async (...params) => {
    let array = true
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      let [table, rows, { columns, serialColumn = sql.defaultSerialColumn } = {}] = params
      if (!Array.isArray(rows)) {
        array = false
        rows = [rows]
      }
      if (!columns) {
        columns = Object.keys(rows[0])
      }
      params = [
        sql`INSERT INTO ${sql.table(table)} (${sql.columns(columns)}) VALUES ${sql.valuesList(rows, { columns })} RETURNING ${sql.column(serialColumn)}`,
        { serialColumn }
      ]
    }
    const [query, { serialColumn = sql.defaultSerialColumn } = {}] = params
    const result = await sql.query(query)
    if (!array) {
      return result.rows[0][serialColumn]
    }
    return result.rows.map(row => row[serialColumn])
  }
}
