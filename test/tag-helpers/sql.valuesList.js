const sql = require('../../')()
const { testTagHelper } = require('../test')

describe('sql.valuesList', () => {
  it('exchange the given values of the list', () => {
    testTagHelper(
      sql.valuesList([
        ['value11', 'value12', 'value13'],
        ['value21', 'value22', 'value23'],
        ['value31', 'value32', 'value33']
      ]),
      {
        text: {
          0: '($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
          5: '($6, $7, $8), ($9, $10, $11), ($12, $13, $14)'
        },
        values: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
      }
    )
  })

  it('exchange the values of the given objects of the list', () => {
    testTagHelper(
      sql.valuesList([
        { column1: 'value11', column2: 'value12', column3: 'value13' },
        { column1: 'value21', column2: 'value22', column3: 'value23' },
        { column1: 'value31', column2: 'value32', column3: 'value33' }
      ]),
      {
        text: {
          0: '($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
          5: '($6, $7, $8), ($9, $10, $11), ($12, $13, $14)'
        },
        values: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
      }
    )
  })

  it('if objects are used, the order of the attributes must not be relevant', () => {
    testTagHelper(
      sql.valuesList([
        { column1: 'value11', column2: 'value12', column3: 'value13' },
        { column2: 'value22', column3: 'value23', column1: 'value21' },
        { column3: 'value33', column1: 'value31', column2: 'value32' }
      ]),
      {
        text: {
          0: '($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
          5: '($6, $7, $8), ($9, $10, $11), ($12, $13, $14)'
        },
        values: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
      }
    )
  })

  it('exchange only the values of the given columns of the given objects of the list', () => {
    testTagHelper(
      sql.valuesList(
        [
          { column1: 'value11', column2: 'value12', column3: 'value13', column4: 'value14' },
          { column1: 'value21', column2: 'value22', column3: 'value23', column4: 'value24' },
          { column1: 'value31', column2: 'value32', column3: 'value33', column4: 'value34' }
        ],
        { columns: ['column1', 'column2'] }
      ),
      {
        text: {
          0: '($1, $2), ($3, $4), ($5, $6)',
          5: '($6, $7), ($8, $9), ($10, $11)'
        },
        values: ['value11', 'value12', 'value21', 'value22', 'value31', 'value32']
      }
    )
  })
})
