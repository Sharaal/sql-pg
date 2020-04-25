module.exports = async () => {
  const { Client } = require('pg')

  const client = new Client({ connectionString: 'postgres://postgres@localhost:5432/postgres' })
  await client.connect()

  const sql = require('./index')({ client })

  return { client, sql }
}
