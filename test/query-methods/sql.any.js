const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.many', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.client = undefined
  })

  it('select rows which are given back as return', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    const actualRows = await sql.any(query)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })
})
