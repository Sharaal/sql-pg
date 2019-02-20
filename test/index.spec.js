const assert = require('power-assert')

const sql = require('../')

describe('sql', () => {
  describe('Extract and bind values', () => {
    it('should work with one value inside the query', () => {
      const expected = {
        text: 'example $1 example',
        parameters: ['value']
      }

      const value = 'value'
      const actual = sql`example ${value} example`

      assert.deepEqual(actual, expected)
    })

    it('should work with one value at the end of the query', () => {
      const expected = {
        text: 'example $1',
        parameters: ['value']
      }

      const value = 'value'
      const actual = sql`example ${value}`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple values', () => {
      const expected = {
        text: 'example $1 example $2 example $3',
        parameters: ['valueA', 'valueB', 'valueC']
      }

      const valueA = 'valueA'
      const valueB = 'valueB'
      const valueC = 'valueC'
      const actual = sql`example ${valueA} example ${valueB} example ${valueC}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Escape keys for tables and columns', () => {
    it('should work with one key', () => {
      const expected = {
        text: 'example "key" example',
        parameters: []
      }

      const key = 'key'
      const actual = sql`example ${sql.key(key)} example`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple keys', () => {
      const expected = {
        text: 'example "keyA", "keyB", "keyC" example',
        parameters: []
      }

      const keys = ['keyA', 'keyB', 'keyC']
      const actual = sql`example ${sql.keys(keys)} example`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Extract and bind value lists', () => {
    it('should work with one value list', () => {})

    it('should work with multiple value lists', () => {})
  })

  describe('Support pairs of column keys and values using as set of updates', () => {
    it('should work with one pair', () => {})

    it('should work with multiple pairs', () => {})
  })

  describe('Support pairs of column keys and values using as set of conditions', () => {
    it('should work with one pair', () => {})

    it('should work with multiple pairs', () => {})
  })
})
