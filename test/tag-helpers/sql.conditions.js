const assert = require('power-assert')

const sql = require('../../')

describe('sql.conditions', () => {
  it('use the given object to build conditions', () => {
    const actual = sql.conditions({
      column1: 'value1',
      column2: 'value2',
      column3: 'value3'
    })

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '"column1" = $1 AND "column2" = $2 AND "column3" = $3',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '"column1" = $6 AND "column2" = $7 AND "column3" = $8',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual(actual5, expected5)
  })
})
