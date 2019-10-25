module.exports = sql => {
  sql.value = value => sql.values([value])
}
