/*

yarn tsn bench

 */

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { runBench } from '../src/bench.util'

runScript(async () => {
  const r = await runBench({
    fns: {
      // rnd: (defer) => {
      //   const _ = _randomInt(1, 10)
      //   defer.resolve()
      // },
      // defer: (defer) => {
      //   const _ = ''
      //   defer.resolve()
      // },
      // benchNoopFn,
      // benchRandomFn, // fails?
      // benchPDelayFn,
      // defer2: async (done) => {
      //   await pDelay()
      //   done.resolve()
      // },
      // defer3: async (done) => {
      //   // await pDelay()
      //   done.resolve()
      // },
      noop: done => done.resolve(),
      random: done => {
        const _ = Math.random()
        done.resolve()
      },
      timeout: done => {
        setTimeout(() => done.resolve(), 0)
      },
      immediate: done => {
        setImmediate(() => done.resolve())
      },
      asyncAwait: async done => {
        await new Promise<void>(resolve => resolve())
        done.resolve()
      },
    },
    runs: 2,
    writePlot: true,
    writeSummary: true,
  })

  console.log(r)
  // console.table(r)
})
