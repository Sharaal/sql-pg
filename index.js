function sql (textFragments, ...valueFragments) {
  textFragments = JSON.parse(JSON.stringify(textFragments))

  let text = textFragments.shift()
  let parameters = []

  let textFragment
  let valueFragment
  do {
    valueFragment = valueFragments.shift()
    if (valueFragment) {
      if (typeof valueFragment !== 'object') {
        valueFragment = sql.value(valueFragment)
      }
      text += valueFragment.text
      parameters = parameters.concat(valueFragment.parameters)
    }
    textFragment = textFragments.shift()
    if (textFragment) {
      text += textFragment
    }
  } while (textFragment)

  let i = 0
  text = text.replace(
    /(\$[0-9]*)/g,
    () => `$${++i}`
  )

  return { text, parameters }
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
  return {
    text: Array.apply(null, { length: values.length }).map(() => '$').join(', '),
    parameters: values
  }
}

sql.value = value => sql.values([value])

sql.valuesList = valuesList => {
  valuesList = valuesList.map(values => sql`(${sql.values(values)})`)
  return {
    text: valuesList
      .map(values => values.text)
      .join(', '),
    parameters: valuesList
      .map(values => values.parameters)
      .reduce((valuesA, valuesB) => valuesA.concat(valuesB), [])
  }
}

sql.pairs = (pairs, separator) => {
  const texts = []
  const parameters = []
  for (const key of Object.keys(pairs)) {
    const value = pairs[key]
    texts.push(`${escapeKey(key)} = $`)
    parameters.push(value)
  }
  return {
    text: texts.join(separator),
    parameters
  }
}

module.exports = sql
