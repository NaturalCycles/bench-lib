/*

yarn tsn filterBench

 */

import { runBenchScript } from '../src'

runBenchScript({
  fns: {
    a: done => {
      done.resolve()
    },
    b: done => {
      done.resolve()
    },
  },
  runs: 2,
})
