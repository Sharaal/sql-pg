module.exports = sql => {
  sql.query = (...params) => {
    if (typeof sql.client !== 'object' || typeof sql.client.query !== 'function') {
      throw new Error('Missing assignment of the initialized pg client to "sql.client"')
    }
    if (typeof params[0] !== 'function' || params[0].symbol !== sql.symbol) {
      throw new Error('Only queries created with the sql tagged template literal are allowed')
    }
    params[0] = params[0]()
    return sql.client.query(...params)
  }
}
