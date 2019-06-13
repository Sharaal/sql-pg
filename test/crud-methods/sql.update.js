const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.update', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.client = undefined
  })

  it('update rows', async () => {
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'UPDATE "table" SET "column1" = $1, "column2" = $2 WHERE "column3" = $3 AND "column4" = $4',
      parameters: ['value1', 'value2', 'value3', 'value4']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'UPDATE "table" SET "column1" = $6, "column2" = $7 WHERE "column3" = $8 AND "column4" = $9',
      parameters: ['value1', 'value2', 'value3', 'value4']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })
})
