import { pDelay } from '@naturalcycles/js-lib'
import { _emptyDirSync, _pathExistsSync, _readJsonSync } from '@naturalcycles/nodejs-lib'
import { expressFunctionFactory } from './cannon.profiles'
import { runCannon } from './cannon.util'
import { tmpDir } from './test/paths.cnst'

test('runCannon', async () => {
  const reportDirPath = `${tmpDir}/cannonTest`
  _emptyDirSync(reportDirPath)

  await runCannon(
    {
      noop: expressFunctionFactory(() => 'yo'),
      async: expressFunctionFactory(async () => await pDelay(0, 'yo')),
    },
    {
      runs: 1,
      duration: 1,
      cooldown: 0,
      reportDirPath,
      silent: true,
      writePlots: true,
      writeSummary: true,
    },
  )

  const summary = _readJsonSync<any>(`${reportDirPath}/Benchmark.summary.json`)
  expect(summary[0]).toMatchObject({
    name: 'noop',
    rpsAvg: expect.any(Number),
    latencyAvg: expect.any(Number),
    // latency50: expect.any(Number),
    // latency90: expect.any(Number),
    // latency99: expect.any(Number),
    throughputAvg: expect.any(Number),
    errors: 0,
    timeouts: 0,
  })
  expect(summary[1]).toMatchObject({
    name: 'async',
  })

  expect(_pathExistsSync(`${reportDirPath}/Benchmark.latencyAvg.svg`)).toBe(true)
}, 240000)
