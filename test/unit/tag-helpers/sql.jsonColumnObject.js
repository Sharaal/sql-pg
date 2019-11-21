const sql = require('../../../')()
const { testTagHelper } = require('../test')

describe('sql.jsonColumnObject', () => {
  it('use the column and keys to build a chain access a JSON object', () => {
    testTagHelper(
      sql.jsonColumnObject(['column', 'keyA', 'keyB', 'keyC']),
      {
        text: '"column"->\'keyA\'->\'keyB\'->\'keyC\'',
        values: []
      }
    )
  })
})
