module.exports = sql => {
  sql.valuesList = (valuesList, { columns = Object.keys(valuesList[0]) } = {}) =>
    valuePosition => {
      const queries = []
      for (const values of valuesList) {
        const query = sql.values(values, { columns })(valuePosition)
        queries.push({
          text: '(' + query.text + ')',
          values: query.values
        })
        valuePosition += query.values.length
      }
      return queries.reduce(
        (queryA, queryB) => ({
          text: queryA.text + (queryA.text ? ', ' : '') + queryB.text,
          values: queryA.values.concat(queryB.values)
        }),
        { text: '', values: [] }
      )
    }
}
