const sql = require('../../../')()
const { testTagHelper } = require('../test')

describe('sql.jsonColumnObject', () => {
  it('use the column and keys to build a chain access a text', () => {
    testTagHelper(
      sql.jsonColumnText(['column', 'keyA', 'keyB', 'keyC']),
      {
        text: '"column"->\'keyA\'->\'keyB\'->>\'keyC\'',
        values: []
      }
    )
  })
})
