const { Client } = require('pg')

module.exports = sql => {
  sql.query = (...params) => {
    if (typeof sql.client !== 'object' || typeof sql.client.query !== 'function') {
      sql.client = new Client({ connectionString: process.env.DATABASE_URL })
      sql.client.connect()
    }
    if (typeof params[0] !== 'function' || params[0].symbol !== sql.symbol) {
      throw new Error('Only queries created with the sql tagged template literal are allowed')
    }
    params[0] = params[0]()
    return sql.client.query(...params)
  }
}
