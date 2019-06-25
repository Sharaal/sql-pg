const assert = require('power-assert')

const sql = require('../')

describe('sql.valueFormatter', () => {
  it('return object values as stringified JSON with default value formatter', () => {
    const object = { key: 'value' }
    const actual = sql`INSERT INTO "table" (json) VALUES (${object})`

    const expected = {
      text: 'INSERT INTO "table" (json) VALUES ($1)',
      parameters: ['{"key":"value"}']
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)
  })
})
