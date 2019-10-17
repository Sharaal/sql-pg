const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.update', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
  })

  it('update rows with the shorthand', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.update(
      'table',
      { column1: 'value1', column2: 'value2' },
      { column3: 'value3', column4: 'value4' }
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "column1" = $1, "column2" = $2 WHERE "column3" = $3 AND "column4" = $4',
        values: ['value1', 'value2', 'value3', 'value4']
      }
    )
  })

  it('update rows with the shorthand without any conditions', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.update(
      'table',
      { column1: 'value1', column2: 'value2' }
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "column1" = $1, "column2" = $2',
        values: ['value1', 'value2']
      }
    )
  })

  it('update rows with the shorthand in a table with schema', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.update(
      ['schema', 'table'],
      { column1: 'value1', column2: 'value2' },
      { column3: 'value3', column4: 'value4' }
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "schema"."table" SET "column1" = $1, "column2" = $2 WHERE "column3" = $3 AND "column4" = $4',
        values: ['value1', 'value2', 'value3', 'value4']
      }
    )
  })

  it('update rows with SQL Tag', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.update(
      sql`UPDATE "table" SET "column" = 'value'`
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "column" = \'value\'',
        values: []
      }
    )
  })
})
