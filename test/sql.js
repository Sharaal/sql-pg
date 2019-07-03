const sql = require('../')()
const { testSql } = require('./test')

describe('sql', () => {
  it('return build function with text and parameter attribute assigned', () => {
    testSql(
      sql`SELECT "*" FROM "table"`,
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })

  it('exchange primitive parameter', () => {
    const value1 = 'value1'
    const value2 = 'value2'
    const value3 = 'value3'
    testSql(
      sql`SELECT "*" FROM "table" WHERE "column1" = ${value1} AND "column2" = ${value2} AND "column3" = ${value3}`,
      {
        text: {
          0: 'SELECT "*" FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
          5: 'SELECT "*" FROM "table" WHERE "column1" = $6 AND "column2" = $7 AND "column3" = $8'
        },
        parameters: ['value1', 'value2', 'value3']
      }
    )
  })

  it('use functions with text and parameters to use "parameterPosition"', () => {
    const condition1 = parameterPosition => ({ text: `"column1" = $${parameterPosition + 1}`, parameters: ['value1'] })
    const condition2 = parameterPosition => ({ text: `"column2" = $${parameterPosition + 1}`, parameters: ['value2'] })
    const condition3 = parameterPosition => ({ text: `"column3" = $${parameterPosition + 1}`, parameters: ['value3'] })
    testSql(
      sql`SELECT "*" FROM "table" WHERE ${condition1} AND ${condition2} AND ${condition3}`,
      {
        text: {
          0: 'SELECT "*" FROM "table" WHERE "column1" = $1 AND "column2" = $2 AND "column3" = $3',
          5: 'SELECT "*" FROM "table" WHERE "column1" = $6 AND "column2" = $7 AND "column3" = $8'
        },
        parameters: ['value1', 'value2', 'value3']
      }
    )
  })
})
