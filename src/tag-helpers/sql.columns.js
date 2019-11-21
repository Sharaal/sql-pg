module.exports = sql => {
  sql.columns = columns => {
    if (!Array.isArray(columns)) {
      columns = Object.keys(columns)
    }
    return () => ({
      text: columns
        .map(column => {
          if (typeof column !== 'function') {
            column = sql.identifier(column)
          }
          return column().text
        })
        .join(', '),
      values: []
    })
  }
}
