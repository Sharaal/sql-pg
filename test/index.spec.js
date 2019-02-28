const assert = require('power-assert')

const sql = require('../')

describe('sql', () => {
  describe('extract and bind values', () => {
    it('should work with one value inside the query', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE id = $1 AND state = \'active\'',
        parameters: ['id']
      }

      const id = 'id'

      const actual = sql`SELECT * FROM users WHERE id = ${id} AND state = 'active'`

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
        text: 'SELECT * FROM users WHERE email = $1 AND passwordhash = $2',
        parameters: ['email', 'passwordhash']
      }

      const email = 'email'
      const passwordhash = 'passwordhash'

      const actual = sql`SELECT * FROM users WHERE email = ${email} AND passwordhash = ${passwordhash}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('escape keys for tables and columns', () => {
    it('should work with one key', () => {
      const expected = {
        text: 'SELECT * FROM "users"',
        parameters: []
      }

      const table = 'users'

      const actual = sql`SELECT * FROM ${sql.key(table)}`

      assert.deepEqual(actual, expected)
    })

    it('should work with a list of keys array based', () => {
      const expected = {
        text: 'SELECT "id", "email" FROM users',
        parameters: []
      }

      const columns = ['id', 'email']

      const actual = sql`SELECT ${sql.keys(columns)} FROM users`

      assert.deepEqual(actual, expected)
    })

    it('should work with a list of keys object based', () => {
      const expected = {
        text: 'SELECT "id", "email" FROM users',
        parameters: []
      }

      const user = { id: 'id', email: 'email' }

      const actual = sql`SELECT ${sql.keys(user)} FROM users`

      assert.deepEqual(actual, expected)
    })
  })

  describe('extract and bind list of values', () => {
    it('should work with one value in the value list', () => {
      const expected = {
        text: 'INSERT INTO users (email) VALUES ($1)',
        parameters: ['email']
      }

      const values = ['email']

      const actual = sql`INSERT INTO users (email) VALUES (${sql.values(values)})`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple values in the value list array based', () => {
      const expected = {
        text: 'INSERT INTO users (email, passwordhash) VALUES ($1, $2)',
        parameters: ['email', 'passwordhash']
      }

      const values = ['email', 'passwordhash']

      const actual = sql`INSERT INTO users (email, passwordhash) VALUES (${sql.values(values)})`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple values in the value list object based', () => {
      const expected = {
        text: 'INSERT INTO users (email, passwordhash) VALUES ($1, $2)',
        parameters: ['email', 'passwordhash']
      }

      const user = { email: 'email', passwordhash: 'passwordhash' }

      const actual = sql`INSERT INTO users (email, passwordhash) VALUES (${sql.values(user)})`

      assert.deepEqual(actual, expected)
    })
  })

  describe('extract and bind multiple value lists', () => {
    it('should work with multiple value lists array based', () => {
      const expected = {
        text: 'INSERT INTO users (email, passwordhash) VALUES ($1, $2), ($3, $4)',
        parameters: ['emailA', 'passwordhashA', 'emailB', 'passwordhashB']
      }

      const valuesList = [
        ['emailA', 'passwordhashA'],
        ['emailB', 'passwordhashB']
      ]

      const actual = sql`INSERT INTO users (email, passwordhash) VALUES ${sql.valuesList(valuesList)}`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple value lists object based', () => {
      const expected = {
        text: 'INSERT INTO users (email, passwordhash) VALUES ($1, $2), ($3, $4)',
        parameters: ['emailA', 'passwordhashA', 'emailB', 'passwordhashB']
      }

      const users = [
        { email: 'emailA', passwordhash: 'passwordhashA' },
        { email: 'emailB', passwordhash: 'passwordhashB' }
      ]

      const actual = sql`INSERT INTO users (email, passwordhash) VALUES ${sql.valuesList(users)}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Support pairs of column keys and values using as set of updates', () => {
    it('should work with one pair', () => {
      const expected = {
        text: 'UPDATE users SET "email" = $1 WHERE id = \'id\'',
        parameters: ['email']
      }

      const user = { email: 'email' }

      const actual = sql`UPDATE users SET ${sql.pairs(user, ', ')} WHERE id = 'id'`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple pairs', () => {
      const expected = {
        text: 'UPDATE users SET "email" = $1, "passwordhash" = $2 WHERE id = \'id\'',
        parameters: ['email', 'passwordhash']
      }

      const user = { email: 'email', passwordhash: 'passwordhash' }

      const actual = sql`UPDATE users SET ${sql.pairs(user, ', ')} WHERE id = 'id'`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Support pairs of column keys and values using as set of conditions', () => {
    it('should work with one pair', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE "email" = $1',
        parameters: ['email']
      }

      const user = { email: 'email' }

      const actual = sql`SELECT * FROM users WHERE ${sql.pairs(user, ' AND ')}`

      assert.deepEqual(actual, expected)
    })

    it('should work with multiple pairs', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE "email" = $1 AND "passwordhash" = $2',
        parameters: ['email', 'passwordhash']
      }

      const user = { email: 'email', passwordhash: 'passwordhash' }

      const actual = sql`SELECT * FROM users WHERE ${sql.pairs(user, ' AND ')}`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Support for nested queries', () => {
    it('should work, especially the renumbering of the binds', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE state = $1 AND id = (SELECT id FROM users WHERE email = $2 AND passwordhash = $3)',
        parameters: ['active', 'email', 'passwordhash']
      }

      const state = 'active'
      const email = 'email'
      const passwordhash = 'passwordhash'

      const actual = sql`SELECT * FROM users WHERE state = ${state} AND id = (${sql`SELECT id FROM users WHERE email = ${email} AND passwordhash = ${passwordhash}`})`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Bad handling of "$" in text fragments', () => {
    it('should accidentally replace "$" with numbered binding in text fragments', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE email = "$1"',
        parameters: []
      }

      const actual = sql`SELECT * FROM users WHERE email = "$"`

      assert.deepEqual(actual, expected)
    })

    it('should accidentally replace "$" with numbered binding in nested query text fragments', () => {
      const expected = {
        text: 'SELECT * FROM (SELECT * FROM users WHERE email = "$1") tmp',
        parameters: []
      }

      const actual = sql`SELECT * FROM (${sql`SELECT * FROM users WHERE email = "$"`}) tmp`

      assert.deepEqual(actual, expected)
    })
  })

  describe('Functional workaround for the bad handling of "$" in text fragments', () => {
    it('should bind reservered "$" correctly if given as binding', () => {
      const expected = {
        text: 'SELECT * FROM users WHERE email = $1',
        parameters: ['$']
      }

      const actual = sql`SELECT * FROM users WHERE email = ${'$'}`

      assert.deepEqual(actual, expected)
    })

    it('should bind reservered "$" correctly if given as binding in nested query', () => {
      const expected = {
        text: 'SELECT * FROM (SELECT * FROM users WHERE email = $1) tmp',
        parameters: ['$']
      }

      const actual = sql`SELECT * FROM (${sql`SELECT * FROM users WHERE email = ${'$'}`}) tmp`

      assert.deepEqual(actual, expected)
    })
  })
})
