const sql = require('../../')
const { testTagHelper } = require('../test')

describe('sql.key', () => {
  it('escapes the given key', () => {
    testTagHelper(
      sql.key('column'),
      {
        text: '"column"',
        parameters: []
      }
    )
  })

  it('escapes the given unsecure key', () => {
    testTagHelper(
      sql.key('column"column'),
      {
        text: '"column""column"',
        parameters: []
      }
    )
  })
})
