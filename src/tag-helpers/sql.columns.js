module.exports = sql => {
  sql.columns = columns => {
    if (!Array.isArray(columns)) {
      columns = Object.keys(columns)
    }
    return () => ({
      text: columns.map(column => sql.identifier(column)().text).join(', '),
      values: []
    })
  }
}
