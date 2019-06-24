const assert = require('power-assert')

const sql = require('../../')

describe('sql.if', () => {
  it('use the then given value in a truly case', () => {
    const actual = sql.if(true, () => ({ text: 'true', parameters: [] }))()
    const expected = { text: 'true', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the else default value in a falsy case', () => {
    const actual = sql.if(false, () => ({ text: 'true', parameters: [] }))()
    const expected = { text: '', parameters: [] }
    assert.deepEqual(actual, expected)
  })

  it('use the else given value in a falsy case', () => {
    const actual = sql.if(false, () => ({ text: 'true', parameters: [] }), () => ({ text: 'false', parameters: [] }))()
    const expected = { text: 'false', parameters: [] }
    assert.deepEqual(actual, expected)
  })
})
