const sql = require('../../../')()
const { testTagHelper } = require('../test')

describe('sql.column', () => {
  it('escapes the given column', () => {
    testTagHelper(
      sql.column('column'),
      {
        text: '"column"',
        values: []
      }
    )
  })

  it('escapes the given unsecure column', () => {
    testTagHelper(
      sql.column('column"column'),
      {
        text: '"column""column"',
        values: []
      }
    )
  })

  it('use the tag helper if given as column', () => {
    testTagHelper(
      sql.column(() => ({ text: '"column"' })),
      {
        text: '"column"',
        values: []
      }
    )
  })
})
