const assert = require('power-assert')

const sql = require('../')

function ignoreWhitespaces (string) {
  return string.replace(/\n/g, '').replace(/ {2,}/g, ' ').trim()
}

describe('sql', () => {
  it('translate the example for the SQL Tag correct with a name', () => {
    const name = 'raa'
    const page = 0

    const actual = sql`
      SELECT name, email FROM users
        WHERE
          validated IS NULL
          ${sql.if(name, sql`AND name LIKE ${`%${name}%`}`)}
        ${sql.pagination(page)}
    `

    const expected = {
      text: ignoreWhitespaces(`
        SELECT name, email FROM users
          WHERE
            validated IS NULL
            AND name LIKE $1
          LIMIT 10 OFFSET 0
      `),
      parameters: ['%raa%']
    }
    assert.deepEqual({ text: ignoreWhitespaces(actual.text), parameters: actual.parameters }, expected)

    const actual0 = actual(0)
    const expected0 = expected
    assert.deepEqual({ text: ignoreWhitespaces(actual0.text), parameters: actual0.parameters }, expected0)
  })
})
