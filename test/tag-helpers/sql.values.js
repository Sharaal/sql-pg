const sql = require('../../')
const { testTagHelper } = require('../test')

describe('sql.values', () => {
  it('exchange the given values', () => {
    testTagHelper(
      sql.values(['value1', 'value2', 'value3']),
      {
        text: {
          0: '$1, $2, $3',
          5: '$6, $7, $8'
        },
        parameters: ['value1', 'value2', 'value3']
      }
    )
  })

  it('exchange the values of the given object', () => {
    testTagHelper(
      sql.values({ column1: 'value1', column2: 'value2', column3: 'value3' }),
      {
        text: {
          0: '$1, $2, $3',
          5: '$6, $7, $8'
        },
        parameters: ['value1', 'value2', 'value3']
      }
    )
  })

  it('exchange only the values of the given keys of the given object', () => {
    testTagHelper(
      sql.values(
        { column1: 'value1', column2: 'value2', column3: 'value3', column4: 'value4' },
        { keys: ['column1', 'column2'] }
      ),
      {
        text: {
          0: '$1, $2',
          5: '$6, $7'
        },
        parameters: ['value1', 'value2']
      }
    )
  })
})
