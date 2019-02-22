const assert = require('power-assert')

const sql = require('../')

describe('sql', () => {
  describe('extract and bind values', () => {
    it('should work with one value inside the query', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE id = $1 AND active = true',
        parameters: ['id']
      }

      const id = 'id'
      const actual = sql`SELECT * FROM users WHERE id = ${id} AND active = true`

      assert.deepEqual(actual, expected)
    })

    it('should work with one value at the end of the query', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE id = $1',
        parameters: ['id']
      }

      const id = 'id'
      const actual = sql`SELECT * FROM users WHERE id = ${id}`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple values', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE id = $1 AND email = $2 AND passwordhash = $3',
        parameters: ['id', 'email', 'passwordhash']
      }

      const id = 'id'
      const email = 'email'
      const passwordhash = 'passwordhash'
      const actual = sql`SELECT * FROM users WHERE id = ${id} AND email = ${email} AND passwordhash = ${passwordhash}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('escape keys for tables and columns', () => {
    it('should work with one key', () => {
      const expected = {
        text: 'SELECT * FROM "table"',
        parameters: []
      }

      const table = 'table'
      const actual = sql`SELECT * FROM ${sql.key(table)}`

      assert.deepEqual(actual, expected)
    })

    it('should work with a list of keys array based', () => {
      const expected = {
        text: 'SELECT "id", "email", "passwordhash" FROM table',
        parameters: []
      }

      const columns = ['id', 'email', 'passwordhash']
      const actual = sql`SELECT ${sql.keys(columns)} FROM table`

      assert.deepEqual(actual, expected)
    })

    it('should work with a list of keys object based', () => {
      const expected = {
        text: 'SELECT "id", "email", "passwordhash" FROM table',
        parameters: []
      }

      const user = { id: 'id', email: 'email', passwordhash: 'passwordhash' }
      const actual = sql`SELECT ${sql.keys(user)} FROM table`

      assert.deepEqual(actual, expected)
    })
  })

  describe('extract and bind list of values', () => {
    it('should work with one value in the value list', () => {
      const expected = {
        text: 'INSERT INTO users (id) VALUES ($1)',
        parameters: ['id']
      }

      const value = ['id']
      const actual = sql`INSERT INTO users (id) VALUES (${sql.values(value)})`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple values in the value list array based', () => {
      const expected = {
        text: 'INSERT INTO users (id, email, passwordhash) VALUES ($1, $2, $3)',
        parameters: ['id', 'email', 'passwordhash']
      }

      const values = ['id', 'email', 'passwordhash']
      const actual = sql`INSERT INTO users (id, email, passwordhash) VALUES (${sql.values(values)})`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple values in the value list object based', () => {
      const expected = {
        text: 'INSERT INTO users (id, email, passwordhash) VALUES ($1, $2, $3)',
        parameters: ['id', 'email', 'passwordhash']
      }

      const user = { id: 'id', email: 'email', passwordhash: 'passwordhash' }
      const actual = sql`INSERT INTO users (id, email, passwordhash) VALUES (${sql.values(user)})`

      assert.deepEqual(actual, expected)
    })
  })

  describe('extract and bind multiple value lists', () => {
    it('should work with multiple value lists array based', () => {
      const expected = {
        text: 'INSERT INTO users (id, email, passwordhash) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
        parameters: ['idA', 'emailA', 'passwordhashA', 'idB', 'emailB', 'passwordhashB', 'idC', 'emailC', 'passwordhashC']
      }

      const valuesList = [
        ['idA', 'emailA', 'passwordhashA'],
        ['idB', 'emailB', 'passwordhashB'],
        ['idC', 'emailC', 'passwordhashC']
      ]
      const actual = sql`INSERT INTO users (id, email, passwordhash) VALUES ${sql.valuesList(valuesList)}`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple value lists object based', () => {
      const expected = {
        text: 'INSERT INTO users (id, email, passwordhash) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
        parameters: ['idA', 'emailA', 'passwordhashA', 'idB', 'emailB', 'passwordhashB', 'idC', 'emailC', 'passwordhashC']
      }

      const users = [
        { id: 'idA', email: 'emailA', passwordhash: 'passwordhashA' },
        { id: 'idB', email: 'emailB', passwordhash: 'passwordhashB' },
        { id: 'idC', email: 'emailC', passwordhash: 'passwordhashC' }
      ]
      const actual = sql`INSERT INTO users (id, email, passwordhash) VALUES ${sql.valuesList(users)}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Support pairs of column keys and values using as set of updates', () => {
    it('should work with one pair', () => {
      const expected = {
        text: 'UPDATE users SET "id" = $1 WHERE id = \'id\'',
        parameters: ['id']
      }

      const user = { id: 'id' }
      const actual = sql`UPDATE users SET ${sql.pairs(user, ', ')} WHERE id = 'id'`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple pairs', () => {
      const expected = {
        text: 'UPDATE users SET "id" = $1, "email" = $2, "passwordhash" = $3 WHERE id = \'id\'',
        parameters: ['id', 'email', 'passwordhash']
      }

      const user = { id: 'id', email: 'email', passwordhash: 'passwordhash' }
      const actual = sql`UPDATE users SET ${sql.pairs(user, ', ')} WHERE id = 'id'`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Support pairs of column keys and values using as set of conditions', () => {
    it('should work with one pair', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE "id" = $1',
        parameters: ['id']
      }

      const user = { id: 'id' }
      const actual = sql`SELECT * FROM users WHERE ${sql.pairs(user, ' AND ')}`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple pairs', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE "id" = $1 AND "email" = $2 AND "passwordhash" = $3',
        parameters: ['id', 'email', 'passwordhash']
      }

      const user = { id: 'id', email: 'email', passwordhash: 'passwordhash' }
      const actual = sql`SELECT * FROM users WHERE ${sql.pairs(user, ' AND ')}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Support for nested queries', () => {
    it('should work, especially the renumbering of the binds', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE email = $1 AND id = (SELECT id FROM users WHERE passwordhash = $2)',
        parameters: ['email', 'passwordhash']
      }

      const email = 'email'
      const passwordhash = 'passwordhash'
      const actual = sql`SELECT * FROM users WHERE email = ${email} AND id = (${sql`SELECT id FROM users WHERE passwordhash = ${passwordhash}`})`

      assert.deepEqual(actual, expected)
    })
  })
})
