const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.table', () => {
  it('escapes the given table', () => {
    testTagHelper(
      sql.table('table'),
      {
        text: '"table"',
        parameters: []
      }
    )
  })

  it('escapes the given unsecure table', () => {
    testTagHelper(
      sql.table('table"table'),
      {
        text: '"table""table"',
        parameters: []
      }
    )
  })

  it('escapes the given schema and table', () => {
    testTagHelper(
      sql.table(['schema', 'table']),
      {
        text: '"schema"."table"',
        parameters: []
      }
    )
  })

  it('escapes the given unsecure schema and table', () => {
    testTagHelper(
      sql.table(['schema"schema', 'table"table']),
      {
        text: '"schema""schema"."table""table"',
        parameters: []
      }
    )
  })
})
