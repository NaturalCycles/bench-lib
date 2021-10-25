/*

yarn tsn nanoidBench

 */

import { nanoid } from 'nanoid'
import { nanoid as nanoidAsync } from 'nanoid/async'
import { nanoid as nanoidNonSecure } from 'nanoid/non-secure'
import { runBenchScript } from '../src'

runBenchScript({
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
})
