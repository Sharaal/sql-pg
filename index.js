function sql (textFragments, ...valueFragments) {
  const build = parameterPosition => {
    let text = textFragments[0]
    let parameters = []
    valueFragments.forEach((valueFragment, i) => {
      if (typeof valueFragment === 'function') {
        valueFragment = valueFragment(parameterPosition)
      }
      if (typeof valueFragment !== 'object') {
        valueFragment = sql.value(valueFragment)(parameterPosition)
      }
      text += valueFragment.text + textFragments[i + 1] || ''
      parameterPosition += valueFragment.parameters.length
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

sql.valuesList = valuesList => parameterPosition => {
  const subValuesList = valuesList.map(values => {
    values = sql.values(values)(parameterPosition)
    parameterPosition += values.parameters.length
    return values
  })
  return {
    text: subValuesList
      .map(values => `(${values.text})`)
      .join(', '),
    parameters: subValuesList
      .map(values => values.parameters)
      .reduce((valuesA, valuesB) => valuesA.concat(valuesB), [])
  }
}

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

module.exports = sql
