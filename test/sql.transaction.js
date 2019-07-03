const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../')()
const { testSql } = require('./test')

describe('sql.transaction', () => {
  beforeEach(() => {
    sql.client = undefined
  })

  it('begins and commits a succesful transaction', async () => {
    const client = {
      query: sinon.fake()
    }

    sql.client = client
    await sql.transaction(async () => {
      await sql.query(sql`SELECT "*" FROM "table"`)
    })

    assert.equal(client.query.callCount, 3)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'BEGIN',
        parameters: []
      }
    )

    testSql(
      client.query.getCall(1).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )

    testSql(
      client.query.getCall(2).args[0],
      {
        text: 'COMMIT',
        parameters: []
      }
    )
  })

  it('begin and rollback a failed transaction', async () => {
    const client = {
      query: sinon.fake()
    }

    sql.client = client
    try {
      await sql.transaction(async () => {
        await sql.query(sql`SELECT "*" FROM "table"`)
        throw new Error('message')
      })
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'message')
    }

    assert.equal(client.query.callCount, 3)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'BEGIN',
        parameters: []
      }
    )

    testSql(
      client.query.getCall(1).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )

    testSql(
      client.query.getCall(2).args[0],
      {
        text: 'ROLLBACK',
        parameters: []
      }
    )
  })
})
