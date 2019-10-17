const sql = require('../../../')()
const { testTagHelper } = require('../test')

describe('sql.conditions', () => {
  it('use the given object to build conditions', () => {
    testTagHelper(
      sql.conditions({ column1: 'value1', column2: 'value2', column3: 'value3' }),
      {
        text: {
          0: '"column1" = $1 AND "column2" = $2 AND "column3" = $3',
          5: '"column1" = $6 AND "column2" = $7 AND "column3" = $8'
        },
        values: ['value1', 'value2', 'value3']
      }
    )
  })
})
