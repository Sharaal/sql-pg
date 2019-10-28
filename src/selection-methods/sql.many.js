module.exports = sql => {
  sql.many = async (...params) => {
    const rows = await sql.any(...params)
    if (rows.length === 0) {
      throw new Error('Expects to have at least one row in the query result')
    }
    return rows
  }
}
