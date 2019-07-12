module.exports = ({
  client,
  defaultSerialColumn = 'id',
  defaultSchema,
  defaultFallbackLimit = 10,
  defaultMaxLimit = 100,
  defaultPageSize = 10
} = {}) => {
  const symbol = Symbol('sql-pg')

  function sql (textFragments, ...valueFragments) {
    const build = parameterPosition => {
      const query = {
        text: textFragments[0],
        parameters: []
      }
      valueFragments.forEach((valueFragment, i) => {
        if (typeof valueFragment !== 'function') {
          valueFragment = sql.value(valueFragment)
        }
        valueFragment = valueFragment(parameterPosition + query.parameters.length)
        query.text += valueFragment.text + textFragments[i + 1]
        query.parameters = query.parameters.concat(valueFragment.parameters)
      })
      return query
    }
    return Object.assign(build, build(0), { symbol })
  }

  sql.client = client

  sql.query = (...params) => {
    if (typeof sql.client !== 'object' || typeof sql.client.query !== 'function') {
      throw Error('Missing assignment of the initialized pg client to "sql.client"')
    }
    const [query] = params
    if (typeof query !== 'function' || query.symbol !== symbol) {
      throw Error('Only queries created with the sql tagged template literal are allowed')
    }
    return sql.client.query(...params)
  }

  sql.transaction = async (callback) => {
    await sql.query(sql`BEGIN`)
    try {
      await callback()
      await sql.query(sql`COMMIT`)
    } catch (e) {
      await sql.query(sql`ROLLBACK`)
      throw e
    }
  }

  sql.defaultSerialColumn = defaultSerialColumn

  sql.insert = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      let [table, rows, { columns, serialColumn = sql.defaultSerialColumn } = {}] = params
      let array = true
      if (!Array.isArray(rows)) {
        rows = [rows]
        array = false
      }
      if (!columns) {
        columns = Object.keys(rows[0])
      }
      const result = await sql.query(sql`INSERT INTO ${sql.table(table)} (${sql.columns(columns)}) VALUES ${sql.valuesList(rows, { columns })} RETURNING ${sql.column(serialColumn)}`)
      if (!array) {
        return result.rows[0][serialColumn]
      }
      return result.rows.map(row => row[serialColumn])
    }
    const [query, { serialColumn = sql.defaultSerialColumn } = {}] = params
    const result = await sql.query(query)
    return result.rows.map(row => row[serialColumn])
  }

  sql.update = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const [table, updates, conditions] = params
      params = [sql`UPDATE ${sql.table(table)} SET ${sql.assignments(updates)} WHERE ${sql.conditions(conditions)}`]
    }
    const [query] = params
    const result = await sql.query(query)
    return result.rowCount
  }

  sql.delete = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const [table, conditions] = params
      params = [sql`DELETE FROM ${sql.table(table)} WHERE ${sql.conditions(conditions)}`]
    }
    const [query] = params
    const result = await sql.query(query)
    return result.rowCount
  }

  sql.any = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      let [table, columns, conditions] = params
      if (!conditions) {
        conditions = columns
        columns = ['*']
      }
      params = [sql`SELECT ${sql.columns(columns)} FROM ${sql.table(table)} WHERE ${sql.conditions(conditions)}`]
    }
    const [query] = params
    const result = await sql.query(query)
    return result.rows
  }

  sql.manyOrNone = sql.any

  sql.many = async (...params) => {
    const rows = await sql.any(...params)
    if (rows.length === 0) {
      throw new Error('Expects to have at least one row in the query result')
    }
    return rows
  }

  sql.oneOrNone = async (...params) => {
    const rows = await sql.any(...params)
    if (rows.length > 1) {
      throw new Error('Expects to have not more than one row in the query result')
    }
    return rows[0]
  }

  sql.one = async (...params) => {
    const row = await sql.oneOrNone(...params)
    if (!row) {
      throw new Error('Expects to have one row in the query result')
    }
    return row
  }

  function escapeIdentifier (identifier) {
    return '"' + identifier.replace(/"/g, '""') + '"'
  }

  sql.defaultSchema = defaultSchema

  sql.table = param => () => {
    const [schema, table] = Array.isArray(param) ? param : [sql.defaultSchema, param]
    return {
      text: (schema ? escapeIdentifier(schema) + '.' : '') + escapeIdentifier(table),
      parameters: []
    }
  }

  sql.columns = columns => {
    if (!Array.isArray(columns)) {
      columns = Object.keys(columns)
    }
    return () => ({
      text: columns.map(escapeIdentifier).join(', '),
      parameters: []
    })
  }

  sql.column = column => sql.columns([column])

  sql.values = (values, { columns = Object.keys(values) } = {}) => {
    if (!Array.isArray(values)) {
      values = columns.map(column => values[column])
    }
    return parameterPosition => ({
      text: Array.apply(null, { length: values.length }).map(() => '$' + (++parameterPosition)).join(', '),
      parameters: values
    })
  }

  sql.value = value => sql.values([value])

  sql.valuesList = (valuesList, { columns = Object.keys(valuesList[0]) } = {}) =>
    parameterPosition => {
      const queries = []
      for (const values of valuesList) {
        const query = sql.values(values, { columns })(parameterPosition)
        queries.push({
          text: '(' + query.text + ')',
          parameters: query.parameters
        })
        parameterPosition += query.parameters.length
      }
      return queries.reduce(
        (queryA, queryB) => ({
          text: queryA.text + (queryA.text ? ', ' : '') + queryB.text,
          parameters: queryA.parameters.concat(queryB.parameters)
        }),
        { text: '', parameters: [] }
      )
    }

  function pairs (pairs, separator) {
    return parameterPosition => {
      const queries = []
      for (const column of Object.keys(pairs)) {
        const value = sql.value(pairs[column])(parameterPosition++)
        queries.push({
          text: escapeIdentifier(column) + ' = ' + value.text,
          parameters: value.parameters
        })
      }
      return queries.reduce(
        (queryA, queryB) => ({
          text: queryA.text + (queryA.text ? separator : '') + queryB.text,
          parameters: queryA.parameters.concat(queryB.parameters)
        }),
        { text: '', parameters: [] }
      )
    }
  }

  sql.assignments = assignments => pairs(assignments, ', ')

  sql.conditions = conditions => pairs(conditions, ' AND ')

  function positiveNumber (number, fallback) {
    number = parseInt(number, 10)
    if (number > 0) {
      return number
    }
    return fallback
  }

  sql.defaultFallbackLimit = defaultFallbackLimit

  sql.defaultMaxLimit = defaultMaxLimit

  sql.limit = (limit, { fallbackLimit = sql.defaultFallbackLimit, maxLimit = sql.defaultMaxLimit } = {}) =>
    () => ({
      text: 'LIMIT ' + Math.min(positiveNumber(limit, fallbackLimit), maxLimit),
      parameters: []
    })

  sql.offset = offset =>
    () => ({
      text: 'OFFSET ' + positiveNumber(offset, 0),
      parameters: []
    })

  sql.defaultPageSize = defaultPageSize

  sql.pagination = (page, { pageSize = sql.defaultPageSize } = {}) =>
    () => ({
      text: sql.limit(pageSize)().text + ' ' + sql.offset(page * pageSize)().text,
      parameters: []
    })

  sql.if = (condition, truly, falsy = () => ({ text: '', parameters: [] })) => condition ? truly : falsy

  return sql
}
