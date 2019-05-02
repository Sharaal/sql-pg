const assert = require('power-assert')

const sql = require('../../')

describe('sql.value', () => {
  it('should exchange the given value', () => {
    const actual = sql.value('value')

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '$1',
      parameters: ['value']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '$6',
      parameters: ['value']
    }
    assert.deepEqual(actual5, expected5)
  })
})
