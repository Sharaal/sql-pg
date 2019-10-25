module.exports = sql => {
  sql.transaction = async callback => {
    await sql.query(sql`BEGIN`)
    try {
      await callback()
      await sql.query(sql`COMMIT`)
    } catch (e) {
      await sql.query(sql`ROLLBACK`)
      throw e
    }
  }
}
