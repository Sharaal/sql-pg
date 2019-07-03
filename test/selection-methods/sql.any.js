const assert = require('power-assert')
const sinon = require('sinon')

const { testSql } = require('../test')

describe('sql.any', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')()
  })

  it('supports shorthands to select all columns', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any('table', { column: 'value' })

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: {
          0: 'SELECT "*" FROM "table" WHERE "column" = $1',
          5: 'SELECT "*" FROM "table" WHERE "column" = $6'
        },
        parameters: ['value']
      }
    )
  })

  it('supports shorthands to select specific columns', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any('table', ['column1', 'column2'], { column3: 'value' })

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: {
          0: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $1',
          5: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $6'
        },
        parameters: ['value']
      }
    )
  })

  it('select rows which are given back as return', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any(sql`SELECT "*" FROM "table"`)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })

  it('select rows which are given back as return also if there are no rows', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any(sql`SELECT "*" FROM "table"`)

    assert.deepEqual(actualRows, expectedRows)

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
