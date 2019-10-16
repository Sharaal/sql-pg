const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.if', () => {
  it('use the then given value in a truly case', () => {
    testTagHelper(
      sql.if(true, () => ({ text: 'true', values: [] })),
      {
        text: 'true',
        values: []
      }
    )
  })

  it('use the else default value in a falsy case', () => {
    testTagHelper(
      sql.if(false, () => ({ text: 'true', values: [] })),
      {
        text: '',
        values: []
      }
    )
  })

  it('use the else given value in a falsy case', () => {
    testTagHelper(
      sql.if(
        false,
        () => ({ text: 'true', values: [] }),
        () => ({ text: 'false', values: [] })
      ),
      {
        text: 'false',
        values: []
      }
    )
  })
})
