const sql = require('../../')
const { testTagHelper } = require('../test')

describe('sql.offset', () => {
  it('use the given positive number', () => {
    testTagHelper(
      sql.offset(5),
      {
        text: 'OFFSET 5',
        parameters: []
      }
    )
  })

  it('use the fallback if there is not a positive number given', () => {
    testTagHelper(
      sql.offset(NaN),
      {
        text: 'OFFSET 0',
        parameters: []
      }
    )
  })
})
