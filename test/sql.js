const assert = require('power-assert')

const sql = require('../')

describe('sql', () => {
  it('return build function with text and parameter attribute assigned', () => {
    const actual = sql`SELECT "*" FROM "table"`

    const expected = {
      text: 'SELECT "*" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)

    const actual0 = actual(0)
    const expected0 = expected
    assert.deepEqual({ text: actual0.text, parameters: actual0.parameters }, expected0)
  })

  it('exchange primitive parameter', () => {
    const value1 = 'value1'
    const value2 = 'value2'
    const value3 = 'value3'

    const actual = sql`SELECT "*" FROM "table" WHERE "column1" = ${value1} AND "column2" = ${value2} AND "column3" = ${value3}`

    const expected = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)

    const actual0 = actual(0)
    const expected0 = expected
    assert.deepEqual({ text: actual0.text, parameters: actual0.parameters }, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $6 AND "column2" = $7 AND "column3" = $8',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actual5.text, parameters: actual5.parameters }, expected5)
  })

  it('use objects with text', () => {
    const column1 = { text: '"column1"', parameters: [] }
    const column2 = { text: '"column2"', parameters: [] }
    const column3 = { text: '"column3"', parameters: [] }

    const actual = sql`SELECT ${column1}, ${column2}, ${column3} FROM "table"`

    const expected = {
      text: 'SELECT "column1", "column2", "column3" FROM "table"',
      parameters: []
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)

    const actual0 = actual(0)
    const expected0 = expected
    assert.deepEqual({ text: actual0.text, parameters: actual0.parameters }, expected0)

    const actual5 = actual(5)
    const expected5 = expected
    assert.deepEqual({ text: actual5.text, parameters: actual5.parameters }, expected5)
  })

  it('use objects with text and parameters', () => {
    const condition1 = { text: '"column1" = $1', parameters: ['value1'] }
    const condition2 = { text: '"column2" = $2', parameters: ['value2'] }
    const condition3 = { text: '"column3" = $3', parameters: ['value3'] }

    const actual = sql`SELECT "*" FROM "table" WHERE ${condition1} AND ${condition2} AND ${condition3}`

    const expected = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)

    const actual0 = actual(0)
    const expected0 = expected
    assert.deepEqual({ text: actual0.text, parameters: actual0.parameters }, expected0)

    const actual5 = actual(5)
    const expected5 = expected
    assert.deepEqual({ text: actual5.text, parameters: actual5.parameters }, expected5)
  })

  it('use functions with text and parameters to use "parameterPosition"', () => {
    const condition1 = parameterPosition => ({ text: `"column1" = $${parameterPosition + 1}`, parameters: ['value1'] })
    const condition2 = parameterPosition => ({ text: `"column2" = $${parameterPosition + 1}`, parameters: ['value2'] })
    const condition3 = parameterPosition => ({ text: `"column3" = $${parameterPosition + 1}`, parameters: ['value3'] })

    const actual = sql`SELECT "*" FROM "table" WHERE ${condition1} AND ${condition2} AND ${condition3}`

    const expected = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actual.text, parameters: actual.parameters }, expected)

    const actual0 = actual(0)
    const expected0 = expected
    assert.deepEqual({ text: actual0.text, parameters: actual0.parameters }, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: 'SELECT "*" FROM "table" WHERE "column1" = $6 AND "column2" = $7 AND "column3" = $8',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actual5.text, parameters: actual5.parameters }, expected5)
  })
})
