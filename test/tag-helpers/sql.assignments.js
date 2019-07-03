const sql = require('../../')
const { testTagHelper } = require('../test')

describe('sql.assignments', () => {
  it('use the given object to build assignments', () => {
    testTagHelper(
      sql.assignments({ column1: 'value1', column2: 'value2', column3: 'value3' }),
      {
        text: {
          0: '"column1" = $1, "column2" = $2, "column3" = $3',
          5: '"column1" = $6, "column2" = $7, "column3" = $8'
        },
        parameters: ['value1', 'value2', 'value3']
      }
    )
  })
})
