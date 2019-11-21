const assert = require('power-assert').strict
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

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "column1" = $1, "column2" = $2 WHERE "column3" = $3 AND "column4" = $4',
        values: ['value1', 'value2', 'value3', 'value4']
      }
    )
  })

  it('update rows with the shorthand without any conditions throws exception', async () => {
    const client = {
      query: sinon.fake()
    }

    sql.client = client
    try {
      await sql.update(
        'table',
        { column1: 'value1', column2: 'value2' }
      )
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have conditions for the update')
    }

    assert.equal(client.query.callCount, 0)
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

    assert.deepStrictEqual(
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
      sql`UPDATE "table" SET "columnA" = 'valueA' WHERE "columnB" = 'valueB'`
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'UPDATE "table" SET "columnA" = \'valueA\' WHERE "columnB" = \'valueB\'',
        values: []
      }
    )
  })
})
