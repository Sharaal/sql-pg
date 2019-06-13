const assert = require('power-assert')

describe('sql.manyOrNone', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
  })

  it('sql.manyOrNone is an alias for sql.any', async () => {
    assert.equal(sql.manyOrNone, sql.any)
  })
})
