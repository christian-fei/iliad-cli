#!/usr/bin/env node
const {login, formatFor} = require('..')
async function main ({username, password} = {}, next) {
  if (!username) return console.log('⛔️ missing username')
  if (!password) return console.log('⛔️ missing password')

  return login({username, password})
  .then(next)
  .then(formatFor(next))
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)
    process.exit(1)
  })
} else {
  module.exports = main
}
