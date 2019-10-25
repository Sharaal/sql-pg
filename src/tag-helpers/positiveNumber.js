module.exports = (number, fallback) => {
  number = parseInt(number, 10)
  if (number > 0) {
    return number
  }
  return fallback
}
