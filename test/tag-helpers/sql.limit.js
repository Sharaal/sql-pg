const assert = require('power-assert')

describe('sql.limit', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.defaultFallbackLimit = 10
    sql.defaultMaxLimit = 100
  })

  it('use the given positive number', () => {
    const actual = sql.limit(5)()
    const expected = { text: 'LIMIT 5', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use a large positive number with the normal default limit', () => {
    const actual = sql.limit(150)()
    const expected = { text: 'LIMIT 100', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the overwritten default limit if there is a to large positive number given', () => {
    sql.defaultMaxLimit = 500
    const actual = sql.limit(150)()
    const expected = { text: 'LIMIT 150', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the given limit if there is a to large number given', () => {
    const actual = sql.limit(150, { maxLimit: 500 })()
    const expected = { text: 'LIMIT 150', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the normal default fallback if there is not a positive number given', () => {
    const actual = sql.limit(NaN)()
    const expected = { text: 'LIMIT 10', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the overwritten default fallback if there is not a positive number given', () => {
    sql.defaultFallbackLimit = 15
    const actual = sql.limit(NaN)()
    const expected = { text: 'LIMIT 15', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the given fallback if there is not a positive number given', () => {
    const actual = sql.limit(NaN, { fallbackLimit: 15 })()
    const expected = { text: 'LIMIT 15', parameters: [] }
    assert.deepEqual(actual, expected)
  })
})
