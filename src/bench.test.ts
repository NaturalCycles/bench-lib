import * as fs from 'fs-extra'
import { runBench } from './bench.util'
import { tmpDir } from './test/paths.cnst'

test('runBench', async () => {
  const reportDirPath = `${tmpDir}/benchTest`
  fs.emptyDirSync(reportDirPath)

  const r = await runBench({
    fns: {
      noop: done => done.resolve(),
      immediate: done => {
        setImmediate(() => done.resolve())
      },
    },
    runs: 1,
    reportDirPath,
    writePlot: true,
    writeSummary: true,
  })

  expect(r).toMatchObject({
    noop: expect.any(Number),
    immediate: expect.any(Number),
  })

  const summary = fs.readJsonSync(`${reportDirPath}/runBench.json`)
  expect(summary).toMatchObject({
    noop: expect.any(Number),
    immediate: expect.any(Number),
  })

  expect(fs.pathExistsSync(`${reportDirPath}/runBench.svg`)).toBe(true)
}, 240000)
