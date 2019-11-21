const assert = require('power-assert').strict

function testSql (actual, expected) {
  assert.equal(typeof actual.symbol, 'symbol')
  assert.equal(actual.symbol.toString(), 'Symbol(sql-pg)')
  test(actual, expected)
}

function testTagHelper (actual, expected) {
  assert.equal(actual.symbol, undefined)
  test(actual, expected)
}

function test (actual, expected) {
  if (typeof expected.text !== 'object') {
    expected.text = {
      0: expected.text,
      5: expected.text
    }
  }
  for (let valuePosition of Object.keys(expected.text)) {
    valuePosition = parseInt(valuePosition, 10)
    const valuePositionActual = actual(valuePosition)
    assert.deepStrictEqual(
      { text: valuePositionActual.text, values: valuePositionActual.values },
      { text: expected.text[valuePosition], values: expected.values }
    )
  }
}

module.exports = { testSql, testTagHelper }
