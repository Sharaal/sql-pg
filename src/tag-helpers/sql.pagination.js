module.exports = sql => {
  sql.defaultPageSize = sql.defaultPageSize || 10

  sql.pagination = (page, { pageSize = sql.defaultPageSize } = {}) =>
    () => ({
      text: sql.limit(pageSize)().text + ' ' + sql.offset(page * pageSize)().text,
      values: []
    })
}
