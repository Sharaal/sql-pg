const sql = require('../../')
const { testTagHelper } = require('../test')

describe('sql.keys', () => {
  it('escape the given keys', () => {
    testTagHelper(
      sql.keys(['column1', 'column2', 'column3']),
      {
        text: '"column1", "column2", "column3"',
        parameters: []
      }
    )
  })

  it('escape the given unsecure keys', () => {
    testTagHelper(
      sql.keys(['column1"column1', 'column2"column2', 'column3"column3']),
      {
        text: '"column1""column1", "column2""column2", "column3""column3"',
        parameters: []
      }
    )
  })

  it('exchange the keys of the given object', () => {
    testTagHelper(
      sql.keys({ column1: 'value1', column2: 'value2', column3: 'value3' }),
      {
        text: '"column1", "column2", "column3"',
        parameters: []
      }
    )
  })
})
