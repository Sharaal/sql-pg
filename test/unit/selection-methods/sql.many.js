const assert = require('power-assert').strict
const sinon = require('sinon')

describe('sql.many', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
  })

  it('select rows which are given back as return if there are some', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.many(sql`SELECT * FROM "table"`)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table"',
        values: []
      }
    )
  })

  it('throw an exception if there are none rows in the result', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    try {
      await sql.many(sql`SELECT * FROM "table"`)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have at least one row in the query result')
    }

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table"',
        values: []
      }
    )
  })
})
