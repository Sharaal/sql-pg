const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.select', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.client = undefined
  })

  it('select all columns', async () => {
    const expectedRows = [{ column1: 'value1', column2: 'value2', column3: 'value3' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.select(
      'table',
      { column1: 'value1', column2: 'value2' }
    )

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $1 AND "column2" = $2',
      parameters: ['value1', 'value2']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $6 AND "column2" = $7',
      parameters: ['value1', 'value2']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })

  it('select only the list of the given columns', async () => {
    const expectedRows = [{ column1: 'value1', column2: 'value2' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.select(
      'table',
      ['column1', 'column2'],
      { column3: 'value3', column4: 'value4' }
    )

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $1 AND "column4" = $2',
      parameters: ['value3', 'value4']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $6 AND "column4" = $7',
      parameters: ['value3', 'value4']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })

  it('select only the list of the given columns as object', async () => {
    const expectedRows = [{ column1: 'value1', column2: 'value2' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    const actualRows = await sql.select(
      'table',
      { column1: 'value1', column2: 'value2' },
      { column3: 'value3', column4: 'value4' }
    )

    assert.deepEqual(actualRows, expectedRows)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $1 AND "column4" = $2',
      parameters: ['value3', 'value4']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'SELECT "column1", "column2" FROM "table" WHERE "column3" = $6 AND "column4" = $7',
      parameters: ['value3', 'value4']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })
})
