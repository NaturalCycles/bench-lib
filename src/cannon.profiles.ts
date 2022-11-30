import * as http from 'node:http'
import * as express from 'express'
import * as helmet from 'helmet'
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
  app.disable('x-powered-by')
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
  app.use(helmet.dnsPrefetchControl())
  app.use(helmet.frameguard())
  app.use(helmet.hidePoweredBy())
  app.use(helmet.hsts())
  app.use(helmet.ieNoOpen())
  app.use(helmet.xssFilter())

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
    app.disable('x-powered-by')
    app.get('/', async (req, res) => res.json(await fn()))
    return http.createServer(app)
  }
}

export function expressSyncFunctionFactory(fn: () => any): HttpServerFactory {
  return async () => {
    const app = express()
    app.disable('etag')
    app.disable('x-powered-by')
    app.get('/', (req, res) => res.json(fn()))
    return http.createServer(app)
  }
}
