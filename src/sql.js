module.exports = (options = {}) => {
  const symbol = Symbol('sql-pg')

  const sql = (textFragments, ...valueFragments) =>
    Object.assign(
      (valuePosition = 0) => {
        const query = {
          text: textFragments[0],
          values: []
        }
        valueFragments.forEach((valueFragment, i) => {
          if (typeof valueFragment !== 'function') {
            valueFragment = sql.value(valueFragment)
          }
          valueFragment = valueFragment(valuePosition + query.values.length)
          query.text += valueFragment.text + textFragments[i + 1]
          query.values = query.values.concat(valueFragment.values)
        })
        return query
      },
      { symbol }
    )

  Object.assign(sql, options)
  Object.assign(sql, { symbol })

  const extensions = [
    './manipulation-methods/sql.delete.js',
    './manipulation-methods/sql.deleteAll.js',
    './manipulation-methods/sql.insert.js',
    './manipulation-methods/sql.update.js',
    './manipulation-methods/sql.updateAll.js',
    './selection-methods/sql.any.js',
    './selection-methods/sql.many.js',
    './selection-methods/sql.manyOrNone.js',
    './selection-methods/sql.one.js',
    './selection-methods/sql.oneOrNone.js',
    './tag-helpers/sql.assignments.js',
    './tag-helpers/sql.column.js',
    './tag-helpers/sql.columns.js',
    './tag-helpers/sql.conditions.js',
    './tag-helpers/sql.identifier.js',
    './tag-helpers/sql.if.js',
    './tag-helpers/sql.limit.js',
    './tag-helpers/sql.offset.js',
    './tag-helpers/sql.pagination.js',
    './tag-helpers/sql.table.js',
    './tag-helpers/sql.value.js',
    './tag-helpers/sql.values.js',
    './tag-helpers/sql.valuesList.js',
    './sql.query.js',
    './sql.transaction.js'
  ]
  extensions.forEach(extension => require(extension)(sql))

  return sql
}
