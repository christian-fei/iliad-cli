#!/usr/bin/env node
const {login, formatFor} = require('..')
async function main ({username, password} = {}, next) {
  if (!username) throw new Error('missing username')
  if (!password) throw new Error('missing password')

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
