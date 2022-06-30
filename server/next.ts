import 'dotenv/config'
import { createServer } from 'http'
import httpProxy from 'http-proxy'
import { parse } from 'url'
import next from 'next'

export const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const logError = (err: any) => console.error(err)

/**
 * Proxy the Twitter API
 *
 * This will bypass any CORS issues, which might help in development.
 */
const twitterApiProxy = httpProxy.createProxyServer({
  target: 'https://api.twitter.com',
  changeOrigin: true,
  headers: { authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
})

app.prepare().then(() => {
  createServer((req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parsedUrl = parse(req.url!, true)

    if (
      parsedUrl.pathname?.slice(0, '/api/twitter/'.length) == '/api/twitter/'
    ) {
      if (!process.env.TWITTER_BEARER_TOKEN) {
        console.error('\x1b[31m', 'Missing env var TWITTER_BEARER_TOKEN')
      }
      req.url = req.url?.slice('/api/twitter'.length)
      twitterApiProxy.web(req, res, {}, logError)
    } else {
      handle(req, res, parsedUrl) // this is next.js's handler
    }
  }).listen(port)

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  )
})
