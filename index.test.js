/* globals test */
const {ok} = require('assert')
const {info} = require('.')
const main = require('./bin')

test('uat', () => {
  test('throws when no config passed', () => {
    main()
      .then(() => ok(false))
      .catch(err => ok(err))
  })

  test('shows info', () => {
    main({
      username: process.env.ILIAD_USERNAME || process.env.npm_config_iliad_username,
      password: process.env.ILIAD_PASSWORD || process.env.npm_config_iliad_password
    }, info)
      .then(result => {
        // console.log(result)
        ok(result)
        ok(result.intestatario)
        ok(result.intestatario.length > 0)
        ok(result.numero)
        ok(result.numero.length > 0)
        ok(result.credito)
        ok(result.credito.length > 0)
        ok(result.rinnovo)
        ok(result.rinnovo.length > 0)
        ok(result.chiamate)
        ok(result.chiamate.length > 0)
        ok(result.sms)
        ok(result.sms.length > 0)
        ok(result.dati)
        ok(result.dati.length > 0)
      })
      .catch((err) => {
        console.error('err', err)
        ok(false)
      })
  })
})
