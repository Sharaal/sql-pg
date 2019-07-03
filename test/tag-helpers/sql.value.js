const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.value', () => {
  it('should exchange the given value', () => {
    testTagHelper(
      sql.value('value'),
      {
        text: {
          0: '$1',
          5: '$6'
        },
        parameters: ['value']
      }
    )
  })
})
