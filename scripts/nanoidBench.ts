/*

yarn tsn nanoidBench

 */

import { _substringAfterLast, _substringBefore } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { nanoid } from 'nanoid'
import { nanoid as nanoidAsync } from 'nanoid/async'
import { nanoid as nanoidNonSecure } from 'nanoid/non-secure'
import { runBench } from '../src'

runScript(async () => {
  await runBench({
    fns: {
      nanoidNonSecure: done => {
        let _count = 0
        const id = nanoidNonSecure()
        if (id) _count++
        done.resolve()
      },
      nanoidSync: done => {
        let _count = 0
        const id = nanoid()
        if (id) _count++
        done.resolve()
      },
      nanoidAsync: async done => {
        let _count = 0
        const id = await nanoidAsync()
        if (id) _count++
        done.resolve()
      },
    },
    runs: 2,
    asciiPlot: true,
    name: _substringBefore(_substringAfterLast(__filename, '/'), '.'),
  })
})
