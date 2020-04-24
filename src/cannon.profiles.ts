import * as express from 'express'
import * as http from 'http'
import { HttpServerFactory } from './cannon.model'

export const bareNodeServerFactory: HttpServerFactory = async () => {
  return http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ hello: 'world' }))
  })
}

export const bareExpressServerFactory: HttpServerFactory = async () => {
  const app = express()
  app.disable('etag')
  app.get('/', (req, res) => res.json({ hello: 'world' }))
  return http.createServer(app)
}

/**
 * Based on: https://github.com/fastify/benchmarks/blob/master/benchmarks/express-with-middlewares.js
 */
export const expressWithMiddlewaresServerFactory: HttpServerFactory = async () => {
  const app = express()
  app.disable('etag')
  app.disable('x-powered-by')

  app.use(require('cors')())
  app.use(require('dns-prefetch-control')())
  app.use(require('frameguard')())
  app.use(require('hide-powered-by')())
  app.use(require('hsts')())
  app.use(require('ienoopen')())
  app.use(require('x-xss-protection')())

  app.get('/', (req, res) => res.json({ hello: 'world' }))

  return http.createServer(app)
}

/**
 * It does await, because tests show no difference (even faster?!) in results between sync and async functions for express.
 */
export function expressFunctionFactory(fn: () => any): HttpServerFactory {
  return async () => {
    const app = express()
    app.disable('etag')
    app.get('/', async (req, res) => res.json(await fn()))
    return http.createServer(app)
  }
}
