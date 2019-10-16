const { testTagHelper } = require('../test')

describe('sql.table', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')()
  })

  it('escapes the given table', () => {
    testTagHelper(
      sql.table('table'),
      {
        text: '"table"',
        values: []
      }
    )
  })

  it('escapes the given schema and table', () => {
    testTagHelper(
      sql.table(['schema', 'table']),
      {
        text: '"schema"."table"',
        values: []
      }
    )
  })

  it('escapes the given table and a default schema', () => {
    sql.defaultSchema = 'schema'
    testTagHelper(
      sql.table('table'),
      {
        text: '"schema"."table"',
        values: []
      }
    )
  })

  it('escapes the given unsecure table', () => {
    testTagHelper(
      sql.table('table"table'),
      {
        text: '"table""table"',
        values: []
      }
    )
  })

  it('escapes the given unsecure schema and table', () => {
    testTagHelper(
      sql.table(['schema"schema', 'table"table']),
      {
        text: '"schema""schema"."table""table"',
        values: []
      }
    )
  })

  it('escapes the given unsecure table and a default unsecure schema', () => {
    sql.defaultSchema = 'schema"schema'
    testTagHelper(
      sql.table('table"table'),
      {
        text: '"schema""schema"."table""table"',
        values: []
      }
    )
  })
})
