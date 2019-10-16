const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.identifier', () => {
  it('escapes the given identifier', () => {
    testTagHelper(
      sql.identifier('identifier'),
      {
        text: '"identifier"',
        values: []
      }
    )
  })

  it('escapes the given unsecure identifier', () => {
    testTagHelper(
      sql.identifier('identifier"identifier'),
      {
        text: '"identifier""identifier"',
        values: []
      }
    )
  })
})
