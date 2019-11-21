const sql = require('../../../')()
const { testTagHelper } = require('../test')

describe('sql.columns', () => {
  it('escape the given columns', () => {
    testTagHelper(
      sql.columns(['column1', 'column2', 'column3']),
      {
        text: '"column1", "column2", "column3"',
        values: []
      }
    )
  })

  it('escape the given unsecure columns', () => {
    testTagHelper(
      sql.columns(['column1"column1', 'column2"column2', 'column3"column3']),
      {
        text: '"column1""column1", "column2""column2", "column3""column3"',
        values: []
      }
    )
  })

  it('exchange the columns of the given object', () => {
    testTagHelper(
      sql.columns({ column1: 'value1', column2: 'value2', column3: 'value3' }),
      {
        text: '"column1", "column2", "column3"',
        values: []
      }
    )
  })

  it('use the tag helper if given as column', () => {
    testTagHelper(
      sql.columns(['column1', () => ({ text: '"column2"' }), 'column3']),
      {
        text: '"column1", "column2", "column3"',
        values: []
      }
    )
  })
})
