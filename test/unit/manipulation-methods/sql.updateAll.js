const assert = require('power-assert').strict
const sinon = require('sinon')

describe('sql.updateAll', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
  })

  it('update rows with the shorthand without any conditions', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.updateAll(
      'table',
      { column1: 'value1', column2: 'value2' }
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "column1" = $1, "column2" = $2',
        values: ['value1', 'value2']
      }
    )
  })
})
