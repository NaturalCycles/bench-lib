/*

yarn tsn demoBench

 */

import { runBenchScript } from '../src'

runBenchScript({
  fns: {
    noop: () => {},
    random: () => {
      const _ = Math.random()
    },
    // timeout: done => {
    //   setTimeout(() => done.resolve(), 0)
    // },
    // asyncAwait: async done => {
    //   await new Promise<void>(resolve => resolve())
    //   done.resolve()
    // },
    // immediate: done => {
    //   setImmediate(() => done.resolve())
    // },
  },
  runs: 1,
  reportDirPath: './demo',
  // writePlot: true,
  writeSummary: true,
})
