module.exports = sql => {
  const pairs = require('./pairs')(sql)

  sql.assignments = assignments => pairs(assignments, ', ')
}
