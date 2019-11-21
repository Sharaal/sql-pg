const assert = require('power-assert').strict
const sinon = require('sinon')

describe('sql.deleteAll', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
  })

  it('delete rows with the shorthand without any conditions', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.deleteAll('table')

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'DELETE FROM "table"',
        values: []
      }
    )
  })
})
