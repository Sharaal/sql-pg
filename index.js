function sql (textFragments, ...valueFragments) {
  const build = parameterPosition => {
    let text = textFragments[0]
    let parameters = []
    valueFragments.forEach((valueFragment, i) => {
      if (!['function', 'object'].includes(typeof valueFragment)) {
        valueFragment = sql.value(valueFragment)
      }
      if (typeof valueFragment === 'function') {
        valueFragment = valueFragment(parameterPosition + parameters.length)
      }
      text += valueFragment.text + textFragments[i + 1]
      parameters = parameters.concat(valueFragment.parameters)
    })
    return { text, parameters }
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

sql.valuesList = valuesList => parameterPosition =>
  valuesList
    .map(values => {
      values = sql.values(values)(parameterPosition)
      parameterPosition += values.parameters.length
      return values
    })
    .reduce(
      (valuesA, valuesB) => ({
        text: valuesA.text + (valuesA.text ? ', ' : '') + `(${valuesB.text})`,
        parameters: valuesA.parameters.concat(valuesB.parameters)
      }),
      { text: '', parameters: [] }
    )

sql.pairs = (pairs, separator) => parameterPosition => {
  const texts = []
  const parameters = []
  for (const key of Object.keys(pairs)) {
    const value = pairs[key]
    texts.push(`${escapeKey(key)} = $${++parameterPosition}`)
    parameters.push(value)
  }
  return {
    text: texts.join(separator),
    parameters
  }
}

function positivNumber (number, fallback) {
  number = parseInt(number)
  if (isNaN(number) || number <= 0) {
    number = fallback
  }
  return number
}

sql.limit = (limit, fallback = 1) => ({
  text: `LIMIT ${positivNumber(limit, fallback)}`,
  parameters: []
})

sql.offset = (offset, fallback = 0) => ({
  text: `OFFSET ${positivNumber(offset, fallback)}`,
  parameters: []
})

sql.pagination = (page, pageSize) =>
  sql`${sql.limit(pageSize)} ${sql.offset(page * pageSize)}`

module.exports = sql
