const { testTagHelper } = require('../test')

describe('sql.pagination', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')()
  })

  it('use the given page and normal default pageSize to set limit and offset', () => {
    testTagHelper(
      sql.pagination(5),
      {
        text: 'LIMIT 10 OFFSET 50',
        values: []
      }
    )
  })

  it('use the first page if there is not a positive page given', () => {
    testTagHelper(
      sql.pagination(NaN),
      {
        text: 'LIMIT 10 OFFSET 0',
        values: []
      }
    )
  })

  it('use the given page and overwritten default pageSize to set limit and offset', () => {
    sql.defaultPageSize = 15
    testTagHelper(
      sql.pagination(5),
      {
        text: 'LIMIT 15 OFFSET 75',
        values: []
      }
    )
  })

  it('use the given page and given pageSize to set limit and offset', () => {
    testTagHelper(
      sql.pagination(5, { pageSize: 15 }),
      {
        text: 'LIMIT 15 OFFSET 75',
        values: []
      }
    )
  })
})
