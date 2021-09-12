const assert = require('power-assert').strict

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('sql', () => {
  let sql
  before(async () => {
    sql = require('../../src/sql')()
    await sql.deleteAll('users')
  })

  after(async () => {
    await sql.deleteAll('users')
    await sql.client.end()
  })

  it('should basically work to send queries to the database', async () => {
    const users = await sql.any('users')
    assert.deepStrictEqual(users, [])
  })

  it('should work to insert, update, select and delete data', async () => {
    const id = await sql.insert(
      'users',
      { name: 'Sharaal', email: 'sql-pg@sharaal.de', passwordhash: '...' }
    )

    const insertedUsers = await sql.any('users')
    assert.equal(insertedUsers.length, 1)
    const insertedUser = insertedUsers[0]
    assert.deepStrictEqual(
      {
        id: insertedUser.id,
        name: insertedUser.name,
        email: insertedUser.email,
        passwordhash: insertedUser.passwordhash,
        validated: insertedUser.validated
      },
      {
        id,
        name: 'Sharaal',
        email: 'sql-pg@sharaal.de',
        passwordhash: '...',
        validated: null
      }
    )
    assert(new Date(insertedUser.created_at).getTime() > 0)
    assert(new Date(insertedUser.updated_at).getTime() > 0)
    assert.equal(new Date(insertedUser.created_at).getTime(), new Date(insertedUser.updated_at).getTime())

    await sleep(10)

    await sql.update('users', { validated: 1 }, { id })

    const updatedUsers = await sql.any('users')
    assert.equal(updatedUsers.length, 1)
    const updatedUser = updatedUsers[0]
    assert.deepStrictEqual(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        passwordhash: updatedUser.passwordhash,
        validated: updatedUser.validated
      },
      {
        id,
        name: 'Sharaal',
        email: 'sql-pg@sharaal.de',
        passwordhash: '...',
        validated: 1
      }
    )
    assert(new Date(updatedUser.created_at).getTime() > 0)
    assert(new Date(updatedUser.updated_at).getTime() > 0)
    assert.notEqual(new Date(updatedUser.created_at).getTime(), new Date(updatedUser.updated_at).getTime())

    await sql.delete('users', { id })

    const deletedUsers = await sql.any('users')
    assert.equal(deletedUsers.length, 0)
  })
})
