const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../../')
const { testSql } = require('../test')

describe('sql.update', () => {
  beforeEach(() => {
    sql.client = undefined
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

    testSql(
      client.query.getCall(0).args[0],
      {
        text: {
          0: 'UPDATE "table" SET "column1" = $1, "column2" = $2 WHERE "column3" = $3 AND "column4" = $4',
          5: 'UPDATE "table" SET "column1" = $6, "column2" = $7 WHERE "column3" = $8 AND "column4" = $9'
        },
        parameters: ['value1', 'value2', 'value3', 'value4']
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

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "column" = \'value\'',
        parameters: []
      }
    )
  })
})
