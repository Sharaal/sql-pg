#!/usr/bin/env node

let debug
try {
  debug = require('debug')('migrate:make')
} catch (e) {
  debug = console.log
}

const fs = require('fs')
const path = require('path')

let file = process.argv[2]
if (!file) {
  debug('name for the migration needs to be given as argument')
  process.exit(1)
}
if (!file.includes('.')) {
  file += '.sql'
}
if (!file.endsWith('.js') && !file.endsWith('.sql')) {
  debug('file ending needs to be ".js" or ".sql" (default if no file ending is given)')
  process.exit(1)
}

const currentUnixTimestamp = Math.floor(Date.now() / 1000)
file = `${currentUnixTimestamp}_${file}`

const directory = path.join(process.cwd(), 'migrations')
if (file.endsWith('.js')) {
  fs.copyFileSync(path.join(__dirname, 'templates/migration.js'), path.join(directory, file))
}
if (file.endsWith('.sql')) {
  fs.copyFileSync(path.join(__dirname, 'templates/migration.sql'), path.join(directory, file))
}

debug(`file "${file}" is created in the migrations directory`)
