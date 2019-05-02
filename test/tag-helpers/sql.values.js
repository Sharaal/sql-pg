const assert = require('power-assert')

const sql = require('../../')

describe('sql.values', () => {
  it('should exchange the given values', () => {
    const actual = sql.values(['value1', 'value2', 'value3'])

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '$1, $2, $3',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '$6, $7, $8',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual(actual5, expected5)
  })
})
