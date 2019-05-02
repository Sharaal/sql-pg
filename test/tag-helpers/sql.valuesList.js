const assert = require('power-assert')

const sql = require('../../')

describe('sql.valuesList', () => {
  it('exchange the given values of the list', () => {
    const actual = sql.valuesList([
      ['value11', 'value12', 'value13'],
      ['value21', 'value22', 'value23'],
      ['value31', 'value32', 'value33']
    ])

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '($6, $7, $8), ($9, $10, $11), ($12, $13, $14)',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual(actual5, expected5)
  })

  it('exchange the values of the given objects of the list', () => {
    const actual = sql.valuesList([
      { column1: 'value11', column2: 'value12', column3: 'value13' },
      { column1: 'value21', column2: 'value22', column3: 'value23' },
      { column1: 'value31', column2: 'value32', column3: 'value33' }
    ])

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '($6, $7, $8), ($9, $10, $11), ($12, $13, $14)',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual(actual5, expected5)
  })

  it('if objects are used, the order of the attributes must not be relevant', () => {
    const actual = sql.valuesList([
      { column1: 'value11', column2: 'value12', column3: 'value13' },
      { column2: 'value22', column3: 'value23', column1: 'value21' },
      { column3: 'value33', column1: 'value31', column2: 'value32' }
    ])

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '($6, $7, $8), ($9, $10, $11), ($12, $13, $14)',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual(actual5, expected5)
  })

  it('exchange only the values of the given keys of the given objects of the list', () => {
    const actual = sql.valuesList(
      [
        { column1: 'value11', column2: 'value12', column3: 'value13', column4: 'value14' },
        { column1: 'value21', column2: 'value22', column3: 'value23', column4: 'value24' },
        { column1: 'value31', column2: 'value32', column3: 'value33', column4: 'value34' }
      ],
      { keys: ['column1', 'column2'] }
    )

    assert.equal(actual.text, undefined)
    assert.equal(actual.parameters, undefined)
    assert.equal(actual.symbol, undefined)

    const actual0 = actual(0)
    const expected0 = {
      text: '($1, $2), ($3, $4), ($5, $6)',
      parameters: ['value11', 'value12', 'value21', 'value22', 'value31', 'value32']
    }
    assert.deepEqual(actual0, expected0)

    const actual5 = actual(5)
    const expected5 = {
      text: '($6, $7), ($8, $9), ($10, $11)',
      parameters: ['value11', 'value12', 'value21', 'value22', 'value31', 'value32']
    }
    assert.deepEqual(actual5, expected5)
  })
})
