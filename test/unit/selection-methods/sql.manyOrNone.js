const assert = require('power-assert').strict

const sql = require('../../../')

describe('sql.manyOrNone', () => {
  it('sql.manyOrNone is an alias for sql.any', async () => {
    assert.equal(sql.manyOrNone, sql.any)
  })
})
