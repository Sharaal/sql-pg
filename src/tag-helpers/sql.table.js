module.exports = sql => {
  sql.table = param => () => {
    const [schema, table] = Array.isArray(param) ? param : [sql.defaultSchema, param]
    return {
      text: (schema ? sql.identifier(schema)().text + '.' : '') + sql.identifier(table)().text,
      values: []
    }
  }
}
