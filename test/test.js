const assert = require('power-assert')

function testSql (actual, expected) {
  if (typeof expected.text === 'object') {
    assert.deepEqual(
      { text: actual.text, parameters: actual.parameters },
      { text: expected.text['0'], parameters: expected.parameters }
    )
  } else {
    assert.deepEqual(
      { text: actual.text, parameters: actual.parameters },
      { text: expected.text, parameters: expected.parameters }
    )
  }
  assert.equal(typeof actual.symbol, 'symbol')
  assert.equal(actual.symbol.toString(), 'Symbol(sql-pg)')
  testBuild(actual, expected)
}

function testTagHelper (actual, expected) {
  assert.equal(actual.text, undefined)
  assert.equal(actual.parameters, undefined)
  assert.equal(actual.symbol, undefined)
  testBuild(actual, expected)
}

function testBuild (actual, expected) {
  if (typeof expected.text !== 'object') {
    expected.text = {
      0: expected.text,
      5: expected.text
    }
  }
  for (let parameterPosition of Object.keys(expected.text)) {
    parameterPosition = parseInt(parameterPosition, 10)
    const parameterPositionActual = actual(parameterPosition)
    assert.deepEqual(
      { text: parameterPositionActual.text, parameters: parameterPositionActual.parameters },
      { text: expected.text[parameterPosition], parameters: expected.parameters }
    )
  }
}

module.exports = { testSql, testTagHelper }
