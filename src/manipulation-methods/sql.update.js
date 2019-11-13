module.exports = sql => {
  sql.update = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const [, , conditions] = params
      if (!conditions) {
        throw new Error('Expects to have conditions for the update')
      }
    }
    return sql.updateAll(...params)
  }
}
