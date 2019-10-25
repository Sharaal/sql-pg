module.exports = sql => {
  const pairs = require('./pairs')(sql)

  sql.conditions = conditions => pairs(conditions, ' AND ')
}
