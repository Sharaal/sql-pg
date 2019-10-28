module.exports = sql => {
  sql.values = (values, { columns = Object.keys(values) } = {}) => {
    if (!Array.isArray(values)) {
      values = columns.map(column => values[column])
    }
    return valuePosition => ({
      text: Array.apply(null, { length: values.length }).map(() => '$' + (++valuePosition)).join(', '),
      values
    })
  }
}
