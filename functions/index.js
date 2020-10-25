const functions = require('firebase-functions')
const { Nuxt } = require('nuxt-start')

const config = {
  dev: false
}

const nuxt = new Nuxt(config)

let isReady = false

async function handleRequest(req, res) {
  if (!isReady) {
    try {
      isReady = await nuxt.ready()
    } catch(err) {
      process.exit(1)
    }
  }
  await nuxt.render(req, res)
}

exports.nuxtssr = functions.https.onRequest(handleRequest)
