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
  return Object.assign(build, Object.assign(build(0), { symbol }))
}

sql.query = (...params) => {
  if (typeof sql.client !== 'object' || typeof sql.client.query !== 'function') {
    throw Error('Missing assignment of the initialized pg client to "sql.client"')
  }
  const [query] = params
  if (typeof query !== 'function' || query.symbol !== symbol) {
    throw Error('only queries created with the sql tagged template literal are allowed')
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

sql.defaultSerialColumn = 'id'

sql.insert = async (...params) => {
  if (typeof params[0] === 'string') {
    let [table, rows, { keys, serialColumn: serialColumn = sql.defaultSerialColumn } = {}] = params
    let array = true
    if (!Array.isArray(rows)) {
      rows = [rows]
      array = false
    }
    if (!keys) {
      keys = Object.keys(rows[0])
    }
    const result = await sql.query(sql`INSERT INTO ${sql.key(table)} (${sql.keys(keys)}) VALUES ${sql.valuesList(rows, { keys })} RETURNING ${sql.key(serialColumn)}`)
    if (!array) {
      return result.rows[0][serialColumn]
    }
    return result.rows.map(row => row[serialColumn])
  }
  const [query, { serialColumn: serialColumn = sql.defaultSerialColumn } = {}] = params
  const result = await sql.query(query)
  return result.rows.map(row => row[serialColumn])
}

sql.update = async (...params) => {
  if (typeof params[0] === 'string') {
    const [table, updates, conditions] = params
    params = [sql`UPDATE ${sql.key(table)} SET ${sql.assignments(updates)} WHERE ${sql.conditions(conditions)}`]
  }
  const [query] = params
  const result = await sql.query(query)
  return result.rowCount
}

sql.delete = async (...params) => {
  if (typeof params[0] === 'string') {
    const [table, conditions] = params
    params = [sql`DELETE FROM ${sql.key(table)} WHERE ${sql.conditions(conditions)}`]
  }
  const [query] = params
  const result = await sql.query(query)
  return result.rowCount
}

sql.any = async (...params) => {
  if (typeof params[0] === 'string') {
    let [table, columns, conditions] = params
    if (!conditions) {
      conditions = columns
      columns = ['*']
    }
    params = [sql`SELECT ${sql.keys(columns)} FROM ${sql.key(table)} WHERE ${sql.conditions(conditions)}`]
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

function escapeKey (key) {
  return `"${key.replace(/"/g, '""')}"`
}

sql.keys = keys => {
  if (!Array.isArray(keys)) {
    keys = Object.keys(keys)
  }
  return () => ({
    text: keys.map(escapeKey).join(', '),
    parameters: []
  })
}

sql.key = key => sql.keys([key])

sql.values = (values, { keys: keys = Object.keys(values) } = {}) => {
  if (!Array.isArray(values)) {
    values = keys.map(key => values[key])
  }
  return parameterPosition => ({
    text: Array.apply(null, { length: values.length }).map(() => `$${++parameterPosition}`).join(', '),
    parameters: values
  })
}

sql.value = value => sql.values([value])

sql.valuesList = (valuesList, { keys: keys = Object.keys(valuesList[0]) } = {}) =>
  parameterPosition => {
    const queries = []
    for (const values of valuesList) {
      const query = sql.values(values, { keys })(parameterPosition)
      queries.push({
        text: `(${query.text})`,
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
    for (const key of Object.keys(pairs)) {
      const value = sql.value(pairs[key])(parameterPosition++)
      queries.push({
        text: `${escapeKey(key)} = ${value.text}`,
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

sql.defaultFallbackLimit = 10

sql.defaultMaxLimit = 100

sql.limit = (limit, { fallbackLimit: fallbackLimit = sql.defaultFallbackLimit, maxLimit: maxLimit = sql.defaultMaxLimit } = {}) =>
  () => ({
    text: `LIMIT ${Math.min(positiveNumber(limit, fallbackLimit), maxLimit)}`,
    parameters: []
  })

sql.offset = offset =>
  () => ({
    text: `OFFSET ${positiveNumber(offset, 0)}`,
    parameters: []
  })

sql.defaultPageSize = 10

sql.pagination = (page, { pageSize: pageSize = sql.defaultPageSize } = {}) =>
  sql`${sql.limit(pageSize)} ${sql.offset(page * pageSize)}`

sql.if = (condition, truly, falsy = () => ({ text: '', parameters: [] })) => condition ? truly : falsy

module.exports = sql
