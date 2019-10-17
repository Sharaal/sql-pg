const { Client } = require('pg')

module.exports = new Client({
  connectionString: 'postgres://postgres@localhost:5432/postgres'
})
