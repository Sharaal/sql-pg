module.exports = sql => {
  const positiveNumber = require('./positiveNumber')

  sql.offset = offset =>
    () => ({
      text: 'OFFSET ' + positiveNumber(offset, 0),
      values: []
    })
}
