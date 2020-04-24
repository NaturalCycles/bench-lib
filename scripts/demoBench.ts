/*

yarn tsn demoBench

 */

import { runBench } from '../src/bench.util'

void runBench({
  fns: {
    noop: done => done.resolve(),
    random: done => {
      const _ = Math.random()
      done.resolve()
    },
    timeout: done => {
      setTimeout(() => done.resolve(), 0)
    },
    asyncAwait: async done => {
      await new Promise(resolve => resolve())
      done.resolve()
    },
    immediate: done => {
      setImmediate(() => done.resolve())
    },
  },
  runs: 1,
  reportDirPath: './demo',
  writePlot: true,
  writeSummary: true,
})
