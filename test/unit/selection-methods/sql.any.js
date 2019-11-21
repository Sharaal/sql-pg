const assert = require('power-assert').strict
const sinon = require('sinon')

describe('sql.any', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
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

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table" WHERE "column" = $1',
        values: ['value']
      }
    )
  })

  it('supports shorthands to select all columns without any conditions', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any('table')

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table"',
        values: []
      }
    )
  })

  it('supports shorthands to select all columns from a table with schema', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any(['schema', 'table'], { column: 'value' })

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "schema"."table" WHERE "column" = $1',
        values: ['value']
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

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $1',
        values: ['value']
      }
    )
  })

  it('supports shorthands to select specific columns without conditions', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any('table', ['column1', 'column2'])

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "column1", "column2" FROM "table"',
        values: []
      }
    )
  })

  it('select rows which are given back as return', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any(sql`SELECT * FROM "table"`)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table"',
        values: []
      }
    )
  })

  it('select rows which are given back as return also if there are no rows', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.any(sql`SELECT * FROM "table"`)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    assert.deepEqual(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT * FROM "table"',
        values: []
      }
    )
  })
})
