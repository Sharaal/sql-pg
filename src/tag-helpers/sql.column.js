module.exports = sql => {
  sql.column = column => sql.columns([column])
}
