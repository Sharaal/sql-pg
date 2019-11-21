module.exports = sql => {
  const jsonColumnByOperator = require('./jsonColumnByOperator')(sql)

  sql.jsonColumnObject = jsonColumn => jsonColumnByOperator(jsonColumn, '->')
}
