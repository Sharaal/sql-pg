const assert = require('power-assert')

describe('sql', () => {
  let client
  let sql
  before(async () => {
    client = require('../../pg')
    await client.connect()
    sql = require('../../')({ client })
  })

  after(async () => {
    await client.end()
  })

  it('should work', async () => {
    const users = await sql.any('users')
    assert.deepEqual(users, [])
  })
})
