const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.column', () => {
  it('escapes the given column', () => {
    testTagHelper(
      sql.column('column'),
      {
        text: '"column"',
        parameters: []
      }
    )
  })

  it('escapes the given unsecure column', () => {
    testTagHelper(
      sql.column('column"column'),
      {
        text: '"column""column"',
        parameters: []
      }
    )
  })
})
