const assert = require('power-assert')

describe('sql.pagination', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.defaultPageSize = 10
  })

  it('use the given page and normal default pageSize to set limit and offset', () => {
    const actual = sql.pagination(5)
    const expected = { text: 'LIMIT 10 OFFSET 50', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the first page if there is not a positive page given', () => {
    const actual = sql.pagination(NaN)
    const expected = { text: 'LIMIT 10 OFFSET 0', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the given page and overwritten default pageSize to set limit and offset', () => {
    sql.defaultPageSize = 15
    const actual = sql.pagination(5)
    const expected = { text: 'LIMIT 15 OFFSET 75', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the given page and given pageSize to set limit and offset', () => {
    const actual = sql.pagination(5, 15)
    const expected = { text: 'LIMIT 15 OFFSET 75', parameters: [] }
    assert.deepEqual(actual, expected)
  })
})
