const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.transaction', () => {
  let sql
  beforeEach(() => {
    sql = require('../')
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

    const actualArg0 = client.query.getCall(0).args[0]
    assert.deepEqual(
      { text: actualArg0.text, parameters: actualArg0.parameters },
      { text: 'BEGIN', parameters: [] }
    )

    const actualArg1 = client.query.getCall(1).args[0]
    assert.deepEqual(
      { text: actualArg1.text, parameters: actualArg1.parameters },
      { text: 'SELECT "*" FROM "table"', parameters: [] }
    )

    const actualArg2 = client.query.getCall(2).args[0]
    assert.deepEqual(
      { text: actualArg2.text, parameters: actualArg2.parameters },
      { text: 'COMMIT', parameters: [] }
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

    const actualArg0 = client.query.getCall(0).args[0]
    assert.deepEqual(
      { text: actualArg0.text, parameters: actualArg0.parameters },
      { text: 'BEGIN', parameters: [] }
    )

    const actualArg1 = client.query.getCall(1).args[0]
    assert.deepEqual(
      { text: actualArg1.text, parameters: actualArg1.parameters },
      { text: 'SELECT "*" FROM "table"', parameters: [] }
    )

    const actualArg2 = client.query.getCall(2).args[0]
    assert.deepEqual(
      { text: actualArg2.text, parameters: actualArg2.parameters },
      { text: 'ROLLBACK', parameters: [] }
    )
  })
})
