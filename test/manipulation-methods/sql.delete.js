const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.delete', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')()
  })

  it('delete rows with the shorthand', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.delete(
      'table',
      { column1: 'value1', column2: 'value2', column3: 'value3' }
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'DELETE FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('delete rows with the shorthand without any conditions', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.delete('table')

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'DELETE FROM "table"',
        values: []
      }
    )
  })

  it('delete rows with the shorthand from a table with schema', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.delete(
      ['schema', 'table'],
      { column1: 'value1', column2: 'value2', column3: 'value3' }
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'DELETE FROM "schema"."table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('delete rows with SQL Tag', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.delete(sql`DELETE FROM "table"`)

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'DELETE FROM "table"',
        values: []
      }
    )
  })
})
