const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.if', () => {
  it('use the then given value in a truly case', () => {
    testTagHelper(
      sql.if(true, () => ({ text: 'true', parameters: [] })),
      {
        text: 'true',
        parameters: []
      }
    )
  })

  it('use the else default value in a falsy case', () => {
    testTagHelper(
      sql.if(false, () => ({ text: 'true', parameters: [] })),
      {
        text: '',
        parameters: []
      }
    )
  })

  it('use the else given value in a falsy case', () => {
    testTagHelper(
      sql.if(
        false,
        () => ({ text: 'true', parameters: [] }),
        () => ({ text: 'false', parameters: [] })
      ),
      {
        text: 'false',
        parameters: []
      }
    )
  })
})
