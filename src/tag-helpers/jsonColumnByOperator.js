module.exports = sql => (jsonColumn, lastOperator) => {
  const [column, ...keys] = jsonColumn
  return () => ({
    text: sql.column(column)().text +
      keys.reduce(
        (text, key, index) =>
          text + (index === keys.length - 1 ? lastOperator : '->') + "'" + key.replace(/'/g, "''") + "'",
        ''
      ),
    values: []
  })
}
