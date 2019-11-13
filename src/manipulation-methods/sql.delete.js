module.exports = sql => {
  sql.delete = async (...params) => {
    if (typeof params[0] === 'string' || Array.isArray(params[0])) {
      const [, conditions] = params
      if (!conditions) {
        throw new Error('Expects to have conditions for the delete')
      }
    }
    return sql.deleteAll(...params)
  }
}
