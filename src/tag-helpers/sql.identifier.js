module.exports = sql => {
  sql.identifier = identifier => () => ({
    text: '"' + identifier.replace(/"/g, '""') + '"',
    values: []
  })
}
