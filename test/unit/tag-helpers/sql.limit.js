const { testTagHelper } = require('../test')

describe('sql.limit', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
  })

  it('use the given positive number', () => {
    testTagHelper(
      sql.limit(5),
      {
        text: 'LIMIT 5',
        values: []
      }
    )
  })

  it('use a large positive number with the normal default limit', () => {
    testTagHelper(
      sql.limit(150),
      {
        text: 'LIMIT 100',
        values: []
      }
    )
  })

  it('use the overwritten default limit if there is a to large positive number given', () => {
    sql.defaultMaxLimit = 500
    testTagHelper(
      sql.limit(150),
      {
        text: 'LIMIT 150',
        values: []
      }
    )
  })

  it('use the given limit if there is a to large number given', () => {
    testTagHelper(
      sql.limit(150, { maxLimit: 500 }),
      {
        text: 'LIMIT 150',
        values: []
      }
    )
  })

  it('use the normal default fallback if there is not a positive number given', () => {
    testTagHelper(
      sql.limit(NaN),
      {
        text: 'LIMIT 10',
        values: []
      }
    )
  })

  it('use the overwritten default fallback if there is not a positive number given', () => {
    sql.defaultFallbackLimit = 15
    testTagHelper(
      sql.limit(NaN),
      {
        text: 'LIMIT 15',
        values: []
      }
    )
  })

  it('use the given fallback if there is not a positive number given', () => {
    testTagHelper(
      sql.limit(NaN, { fallbackLimit: 15 }),
      {
        text: 'LIMIT 15',
        values: []
      }
    )
  })
})
