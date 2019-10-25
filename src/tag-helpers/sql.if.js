module.exports = sql => {
  sql.if = (condition, truly, falsy = () => ({ text: '', values: [] })) => condition ? truly : falsy
}
