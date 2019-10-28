module.exports = sql => {
  sql.one = async (...params) => {
    const row = await sql.oneOrNone(...params)
    if (!row) {
      throw new Error('Expects to have one row in the query result')
    }
    return row
  }
}
