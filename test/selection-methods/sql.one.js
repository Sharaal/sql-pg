const assert = require('power-assert')
const sinon = require('sinon')

const { testSql } = require('../test')

describe('sql.one', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')()
  })

  it('select one row which is given back as return', async () => {
    const expectedRow = { column: 'value' }
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [expectedRow] }))
    }

    sql.client = client
    const actualRow = await sql.one(sql`SELECT "*" FROM "table"`)

    assert.deepEqual(actualRow, expectedRow)

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })

  it('throw an exception if a there is none row in the result', async () => {
    const expectedRow = undefined
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [expectedRow] }))
    }

    sql.client = client
    try {
      await sql.one(sql`SELECT "*" FROM "table"`)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have one row in the query result')
    }

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })

  it('throw an exception if a there is more than one row in the result', async () => {
    const expectedRows = [{ column: 'value' }, { column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    try {
      await sql.one(sql`SELECT "*" FROM "table"`)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have not more than one row in the query result')
    }

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })
})
