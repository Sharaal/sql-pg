const assert = require('power-assert')

const sql = require('../../')

describe('sql.values', () => {
  it('exchange the given values', () => {
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

  it('exchange the values of the given object', () => {
    const actual = sql.values({ column1: 'value1', column2: 'value2', column3: 'value3' })

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

  it('exchange only the values of the given keys of the given object', () => {
    const actual = sql.values(
      { column1: 'value1', column2: 'value2', column3: 'value3', column4: 'value4' },
      { keys: ['column1', 'column2'] }
    )

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '$1, $2',
      parameters: ['value1', 'value2']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '$6, $7',
      parameters: ['value1', 'value2']
    }
    assert.deepEqual(actual5, expected5)
  })
})
