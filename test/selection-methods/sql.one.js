const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../../')

describe('sql.one', () => {
  beforeEach(() => {
    sql.client = undefined
  })

  it('select one row which is given back as return', async () => {
    const expectedRow = { column: 'value' }
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [expectedRow] }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    const actualRow = await sql.one(query)

    assert.deepEqual(actualRow, expectedRow)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })

  it('throw an exception if a there is none row in the result', async () => {
    const expectedRow = undefined
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [expectedRow] }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    try {
      await sql.one(query)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have one row in the query result')
    }

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })

  it('throw an exception if a there is more than one row in the result', async () => {
    const expectedRows = [{ column: 'value' }, { column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    try {
      await sql.one(query)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have not more than one row in the query result')
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
