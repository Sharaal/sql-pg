const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.any', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.client = undefined
  })

  it('select rows which are given back as return if there are some', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    const actualRows = await sql.many(query)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })

  it('throw an exception if a there are none rows in the result', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    try {
      await sql.many(query)
      assert(false)
    } catch (e) {
      assert.equal(e.message, '"sql.many" expects to have one or more rows in the query result')
    }

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })
})
