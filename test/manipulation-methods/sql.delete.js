const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../../')

describe('sql.delete', () => {
  beforeEach(() => {
    sql.client = undefined
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'DELETE FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'DELETE FROM "table" WHERE "column1" = $6 AND "column2" = $7 AND "column3" = $8',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })

  it('delete rows with SQL Tag', async () => {
    const expectedRowCount = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
    }

    sql.client = client
    const actualRowCount = await sql.delete(
      sql`DELETE FROM "table"`
    )

    assert.equal(actualRowCount, expectedRowCount)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'DELETE FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'DELETE FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })
})
