const cheerio = require('cheerio')
const got = require('got')
const {CookieJar} = require('tough-cookie')
const cookieJar = new CookieJar()
const FormData = require('form-data')

exports.formatFor = function formatFor (fn) {
  return data => exports.format(fn.name, data)
}

exports.format = function format (type, data) {
  if (type === 'info') {
    Object.keys(data)
    .forEach(key => {
      console.log(`${key}: ${data[key]}`)
    })
    return data
  }
  throw new Error('unhandled type', type)
}

exports.info = function info (html) {
  const $ = cheerio.load(html)

  return {
    intestatario: $('.current-user .bold').first().text(),
    numero: $('.current-user .smaller').slice(1).last().text().replace('Numero: ', ''),
    credito: $('.p-conso h2 .red').text(),
    rinnovo: $('.p-conso .end_offerta').text().replace(/\s\s+/g, ''),
    chiamate: $('.p-conso .conso__text').eq(0).first('.red').text().trim().replace(/\s\s+/g, '').split(' ')[1],
    sms: $('.p-conso .conso__text').eq(1).first('.red').text().trim().replace(/\s\s+/g, '').split(' ')[0],
    dati: $('.p-conso .conso__text').eq(2).first('.red').text().trim().replace(/\s\s+/g, '').split(' ')[0]
  }
}

exports.login = function ({username, password} = {}) {
  const url = 'https://www.iliad.it/account/'
  const followRedirect = true

  const body = new FormData()
  body.append('login-ident', username)
  body.append('login-pwd', password)

  const options = { followRedirect, cookieJar, body }

  return got.post(url, options)
  .catch(({statusCode, body, headers}) => {
    if (statusCode === 302) {
      const cookieHeader = headers['set-cookie']
      if (!Array.isArray(cookieHeader)) throw new Error('missing cookie')
      cookieJar.setCookieSync(cookieHeader[0], 'https://www.iliad.it')
      return got.get(url, {cookieJar})
      .then(html => html.body)
      .catch(() => { throw new Error('not logged in') })
    }
    throw new Error('unhandled')
  })
}
