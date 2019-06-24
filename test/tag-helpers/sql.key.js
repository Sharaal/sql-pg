const assert = require('power-assert')

const sql = require('../../')

describe('sql.key', () => {
  it('escapes the given key', () => {
    const actual = sql.key('column')()
    const expected = {
      text: '"column"',
      parameters: []
    }
    assert.deepEqual(actual, expected)
  })

  it('escapes the given unsecure key', () => {
    const actual = sql.key('column"column')()
    const expected = {
      text: '"column""column"',
      parameters: []
    }
    assert.deepEqual(actual, expected)
  })
})
