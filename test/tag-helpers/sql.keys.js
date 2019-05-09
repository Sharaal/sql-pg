const assert = require('power-assert')

const sql = require('../../')

describe('sql.keys', () => {
  it('escape the given keys', () => {
    const actual = sql.keys([
      'column1',
      'column2',
      'column3'
    ])
    const expected = {
      text: '"column1", "column2", "column3"',
      parameters: []
    }
    assert.deepEqual(actual, expected)
  })

  it('escape the given unsecure keys', () => {
    const actual = sql.keys([
      'column1"column1',
      'column2"column2',
      'column3"column3'
    ])
    const expected = {
      text: '"column1""column1", "column2""column2", "column3""column3"',
      parameters: []
    }
    assert.deepEqual(actual, expected)
  })
})