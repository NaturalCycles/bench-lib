import { _emptyDirSync, _pathExistsSync, _readJsonSync } from '@naturalcycles/nodejs-lib'
import { runBench } from './bench.util'
import { tmpDir } from './test/paths.cnst'

test('runBench', async () => {
  const reportDirPath = `${tmpDir}/benchTest`
  _emptyDirSync(reportDirPath)

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

  const summary = _readJsonSync(`${reportDirPath}/runBench.json`)
  expect(summary).toMatchObject({
    noop: expect.any(Number),
    immediate: expect.any(Number),
  })

  expect(_pathExistsSync(`${reportDirPath}/runBench.svg`)).toBe(true)
}, 240000)
