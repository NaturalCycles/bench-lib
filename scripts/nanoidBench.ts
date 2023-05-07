/*

yarn tsn nanoidBench

 */

// import { nanoid as nanoidAsync } from 'nanoid/async'
// import { nanoid as nanoidNonSecure } from 'nanoid/non-secure'
import { nanoid } from '@naturalcycles/nodejs-lib'
import { runBenchScript } from '../src'
const { nanoid: nanoidAsync } = require('nanoid/async')
const { nanoid: nanoidNonSecure } = require('nanoid/non-secure')

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
