const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../../')()

describe('sql.query', () => {
  beforeEach(() => {
    sql.client = undefined
  })

  it('passes all params to the "client.query()"', async () => {
    const client = {
      query: sinon.fake()
    }

    sql.client = client
    sql.query(sql`SELECT * FROM "table"`, 'param2', 'param3')

    assert.equal(client.query.callCount, 1)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table"',
        values: []
      }
    )

    const actualArg1 = client.query.getCall(0).args[1]
    const expectedArg1 = 'param2'
    assert.deepEqual(actualArg1, expectedArg1)

    const actualArg2 = client.query.getCall(0).args[2]
    const expectedArg2 = 'param3'
    assert.deepEqual(actualArg2, expectedArg2)
  })

  it('throw an exception "sql.query()" is used without assign a client', async () => {
    const client = {
      query: sinon.fake()
    }

    try {
      sql.query('SELECT * FROM "table"')
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Missing assignment of the initialized pg client to "sql.client"')
    }

    assert.equal(client.query.callCount, 0)
  })

  it('throw an exception if a string is used as query', async () => {
    const client = {
      query: sinon.fake()
    }

    sql.client = client
    try {
      sql.query('SELECT * FROM "table"')
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Only queries created with the sql tagged template literal are allowed')
    }

    assert.equal(client.query.callCount, 0)
  })
})
