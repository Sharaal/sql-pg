module.exports = sql => (pairs, separator) => valuePosition => {
  const queries = []
  for (const column of Object.keys(pairs)) {
    const value = sql.value(pairs[column])(valuePosition++)
    queries.push({
      text: sql.column(column)().text + ' = ' + value.text,
      values: value.values
    })
  }
  return queries.reduce(
    (queryA, queryB) => ({
      text: queryA.text + (queryA.text ? separator : '') + queryB.text,
      values: queryA.values.concat(queryB.values)
    }),
    { text: '', values: [] }
  )
}
