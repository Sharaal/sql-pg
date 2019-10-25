module.exports = sql => {
  sql.oneOrNone = async (...params) => {
    const rows = await sql.any(...params)
    if (rows.length > 1) {
      throw new Error('Expects to have not more than one row in the query result')
    }
    return rows[0]
  }
}
