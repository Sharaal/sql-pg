const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../')

describe('sql.valueFormatter', () => {
  beforeEach(() => {
    sql.client = undefined
  })

  it('return object values as stringified JSON with default value formatter', () => {
    const object = { key: 'value' }

    const actual = sql`INSERT INTO "table" (json) VALUES (${object})`

    const expected = {
      text: 'INSERT INTO "table" (json) VALUES ($1)',
      parameters: ['{"key":"value"}']
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)
  })

  it('supports value formatter also in manipulation methods', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
    }

    sql.client = client
    const actualId = await sql.insert(
      'table',
      { column: { key: 'value' } }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column") VALUES ($1) RETURNING "id"',
      parameters: ['{"key":"value"}']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column") VALUES ($6) RETURNING "id"',
      parameters: ['{"key":"value"}']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })
})
