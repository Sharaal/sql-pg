module.exports = sql => {
  const positiveNumber = require('./positiveNumber')

  sql.defaultFallbackLimit = sql.defaultFallbackLimit || 10

  sql.defaultMaxLimit = sql.defaultMaxLimit || 100

  sql.limit = (limit, { fallbackLimit = sql.defaultFallbackLimit, maxLimit = sql.defaultMaxLimit } = {}) =>
    () => ({
      text: 'LIMIT ' + Math.min(positiveNumber(limit, fallbackLimit), maxLimit),
      values: []
    })
}
