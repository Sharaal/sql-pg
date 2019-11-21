module.exports = sql => {
  const jsonColumnByOperator = require('./jsonColumnByOperator')(sql)

  sql.jsonColumnText = jsonColumn => jsonColumnByOperator(jsonColumn, '->>')
}
