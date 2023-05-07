/*

yarn tsn startsWith

 */

import { _range } from '@naturalcycles/js-lib'
import { runBenchScript } from '../src'

const strings = _range(100).map(String)

/* eslint-disable */

runBenchScript({
  fns: {
    startsWith: done => {
      let _count = 0
      strings.forEach(s => {
        if (s.startsWith('2')) _count++
      })

      done.resolve()
    },
    indexOf: done => {
      let _count = 0
      strings.forEach(s => {
        if (s.indexOf('2') === 0) _count++
      })

      done.resolve()
    },
  },
  runs: 1,
  asciiPlot: true,
})
