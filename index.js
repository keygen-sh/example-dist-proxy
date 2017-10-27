// Be sure to add these ENV variables!
const {
  KEYGEN_ACCOUNT_ID,
  KEYGEN_PRODUCT_ID,
  KEYGEN_POLICY_ID,
  PORT = 8080
} = process.env

const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(morgan('combined'))

app.get('/download/:platform/:file', async (req, res) => {
  const { platform, file } = req.params
  const { license } = req.query

  https.get(`https://dist.keygen.sh/v1/${KEYGEN_ACCOUNT_ID}/${KEYGEN_PRODUCT_ID}/releases/${platform}/${file}?policy=${KEYGEN_POLICY_ID}&key=${license}`, dist => {
    res.statusCode = dist.statusCode
    res.set(dist.headers)

    dist.pipe(res)
  })
})

app.get('/latest/:platform/:extension', async (req, res) => {
  const { platform, extension } = req.params
  const { license } = req.query

  https.get(`https://dist.keygen.sh/v1/${KEYGEN_ACCOUNT_ID}/${KEYGEN_PRODUCT_ID}/latest/${platform}/${extension}?policy=${KEYGEN_POLICY_ID}&key=${license}`, dist => {
    if (dist.statusCode === 307) {
      https.get(dist.headers.location, redirect => {
        res.statusCode = redirect.statusCode
        res.set(redirect.headers)

        redirect.pipe(res)
      })
    } else {
      res.statusCode = dist.statusCode
      res.set(dist.headers)

      dist.pipe(res)
    }
  })
})

app.get('/update/:platform/:extension/:version', async (req, res) => {
  const { platform, extension, version } = req.params
  const { license } = req.query

  https.get(`https://dist.keygen.sh/v1/${KEYGEN_ACCOUNT_ID}/${KEYGEN_PRODUCT_ID}/update/${platform}/${extension}/${version}?policy=${KEYGEN_POLICY_ID}&key=${license}`, dist => {
    if (dist.statusCode === 307) {
      https.get(dist.headers.location, redirect => {
        res.statusCode = redirect.statusCode
        res.set(redirect.headers)

        redirect.pipe(res)
      })
    } else {
      res.statusCode = dist.statusCode
      res.set(dist.headers)

      dist.pipe(res)
    }
  })
})

process.on('unhandledRejection', err => {
  console.error(`Unhandled rejection: ${err}`, err.stack)
})

const server = app.listen(PORT, 'localhost', () => {
  const { address, port } = server.address()

  console.log(`Listening at http://${address}:${port}`)
})