const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../../')

describe('sql.any', () => {
  beforeEach(() => {
    sql.client = undefined
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table" WHERE "column" = $1',
      parameters: ['value']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $1',
      parameters: ['value']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })

  it('select rows which are given back as return', async () => {
    const expectedRows = [{ column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    const actualRows = await sql.any(query)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })

  it('select rows which are given back as return also if there are no rows', async () => {
    const expectedRows = []
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    const query = sql`SELECT "*" FROM "table"`

    sql.client = client
    const actualRows = await sql.any(query)

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)
  })
})
