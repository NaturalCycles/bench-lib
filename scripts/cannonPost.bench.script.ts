/*

yarn tsn cannonPost.bench

 */

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import express = require('express')
import * as http from 'http'
import { runCannon } from '../src'

runScript(async () => {
  await runCannon(
    {
      '02-ajv': async () => {
        const app = express()
        app.disable('etag')
        app.disable('x-powered-by')
        app.post('/', (req, res) => res.json({ ok: true }))
        return http.createServer(app)
      },
    },
    {
      runs: 1,
      duration: 2,
      cooldown: 1,
      renderLatencyTable: false,
      autocannonOptions: {
        method: 'POST',
        body: JSON.stringify({ hello: 'world' }),
        expectBody: JSON.stringify({ ok: true }),
      },
    },
  )
})
