function sql (textFragments, ...valueFragments) {
  const build = parameterPosition => {
    const query = {
      text: textFragments[0],
      parameters: []
    }
    valueFragments.forEach((valueFragment, i) => {
      if (!['function', 'object'].includes(typeof valueFragment)) {
        valueFragment = sql.value(valueFragment)
      }
      if (typeof valueFragment === 'function') {
        valueFragment = valueFragment(parameterPosition + query.parameters.length)
      }
      query.text += valueFragment.text + textFragments[i + 1]
      query.parameters = query.parameters.concat(valueFragment.parameters)
    })
    return query
  }
  return Object.assign(build, build(0))
}

function escapeKey (key) {
  return `"${key.replace(/"/g, '""')}"`
}

sql.keys = keys => {
  if (!Array.isArray(keys)) {
    keys = Object.keys(keys)
  }
  return {
    text: keys.map(escapeKey).join(', '),
    parameters: []
  }
}

sql.key = key => sql.keys([key])

sql.values = values => {
  if (!Array.isArray(values)) {
    values = Object.values(values)
  }
  return parameterPosition => ({
    text: Array.apply(null, { length: values.length }).map(() => `$${++parameterPosition}`).join(', '),
    parameters: values
  })
}

sql.value = value => sql.values([value])

sql.valuesList = valuesList => parameterPosition => {
  const queries = []
  for (const values of valuesList) {
    const query = sql.values(values)(parameterPosition)
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

sql.assignments = pairs => parameterPosition =>
  sql`(${sql.keys(pairs)}) = (${sql.values(pairs)})`

sql.pairs = (pairs, separator) => parameterPosition => {
  const queries = []
  for (const key of Object.keys(pairs)) {
    const value = pairs[key]
    queries.push({
      text: `${escapeKey(key)} = $${++parameterPosition}`,
      parameters: [value]
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

function positivNumber (number, fallback) {
  number = parseInt(number, 10)
  if (number > 0) {
    return number
  }
  return fallback
}

sql.limit = (actualLimit, maxLimit = Infinity, fallback = 1) => ({
  text: `LIMIT ${Math.min(positivNumber(actualLimit, fallback), maxLimit)}`,
  parameters: []
})

sql.offset = (offset, fallback = 0) => ({
  text: `OFFSET ${positivNumber(offset, fallback)}`,
  parameters: []
})

sql.pagination = (page, pageSize) =>
  sql`${sql.limit(pageSize)} ${sql.offset(page * pageSize)}`

module.exports = sql
