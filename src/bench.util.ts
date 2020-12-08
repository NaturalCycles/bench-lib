import { pDefer, _range } from '@naturalcycles/js-lib'
import { dimGrey, yellow } from '@naturalcycles/nodejs-lib/dist/colors'
import type { Event, Suite } from 'benchmark'
import * as Benchmark from 'benchmark'
import * as fs from 'fs-extra'
import * as vega from 'vega'
import type { Spec } from 'vega'
import * as vegaLite from 'vega-lite'
import type { TopLevelSpec } from 'vega-lite'
import type { HertzMap, RunBenchOptions } from './bench.model'

/**
 * Only DeferredFunctions are allowed, because of: https://github.com/bestiejs/benchmark.js/issues/111
 */
export async function runBench(opt: RunBenchOptions): Promise<HertzMap> {
  const { runs = 1, writeSummary = false, writePlot = false, name = 'runBench' } = opt
  const { reportDirPath = `./tmp/${name}` } = opt

  console.log('\n\n')

  const results: HertzMap[] = []

  for await (const run of _range(1, runs + 1)) {
    results.push(await runBenchOnce(opt, run))
  }

  const avg: HertzMap = {}
  Object.keys(results[0]!).forEach(name => {
    let total = 0
    results.forEach(map => (total += map[name]!))
    avg[name] = total / runs
    if (avg[name]! > 2) avg[name] = Math.round(avg[name]!)
  })

  console.log('\n\n')

  if (writeSummary) {
    // const summary: StringMap<number[]> = {}
    // names.forEach(name => {
    //   summary[name] = results.hz.map(map => map[name]!)
    // })

    await fs.ensureDir(reportDirPath)
    const summaryJsonPath = `${reportDirPath}/${name}.json`
    await fs.writeJson(summaryJsonPath, avg, { spaces: 2 })
    console.log(`saved ${dimGrey(summaryJsonPath)}`)
  }

  if (writePlot) {
    await fs.ensureDir(reportDirPath)

    const spec = benchResultsToVegaSpec(avg)
    const view = new vega.View(vega.parse(spec), { renderer: 'none' })
    const svg = await view.toSVG()

    const plotPath = `${reportDirPath}/${name}.svg`
    await fs.writeFile(plotPath, svg)
    console.log(`saved ${dimGrey(plotPath)}`)
  }

  return avg
}

async function runBenchOnce(opt: RunBenchOptions, run: number): Promise<HertzMap> {
  const defer = pDefer<HertzMap>()

  const suite = new Benchmark.Suite()
    .on('cycle', (event: Event) => {
      console.log(String(event.target))
      // console.log(event.target)
    })
    .on('complete', function (this: Suite) {
      console.log(`Fastest in run ${yellow(run)} is ` + this.filter('fastest').map('name' as any))
      // console.log(this[0].stats)
      // console.log(this)

      const results: HertzMap = {}
      this.forEach((b: Benchmark) => {
        results[(b as any).name] = b.hz
      })
      defer.resolve(results)
    })
    .on('error', function (event: any) {
      console.log(event.target.error)
    })

  const fnNames = Object.keys(opt.fns || {})
  if (run % 2 === 0) fnNames.reverse()
  fnNames.forEach(name => {
    suite.add(opt.fns![name]!, {
      defer: true,
      name,
    })
  })

  suite.run({
    // async: true,
    // defer: true,
  })

  return await defer
}

function benchResultsToVegaSpec(map: HertzMap): Spec {
  const values = Object.entries(map).map(([name, hz]) => {
    return {
      name,
      hz,
    }
  })

  // console.log(values)

  const liteSpec: TopLevelSpec = {
    // title: 'title',
    // "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    data: {
      values,
    },
    mark: 'bar',
    encoding: {
      y: {
        field: 'name',
        type: 'ordinal',
        axis: {
          title: '',
        },
      },
      x: {
        field: 'hz',
        type: 'quantitative',
        axis: {
          title: 'ops/sec',
        },
      },
    },
  }

  const { spec } = vegaLite.compile(liteSpec)
  return spec
}
