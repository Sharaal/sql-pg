const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.none', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.client = undefined
  })

  it('runs the query without exception if there are non rows in the result', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    await sql.none(query)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })

  it('throw an exception if a there is at least one row in the result', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    try {
      await sql.none(query)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have none rows in the query result')
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
