import { pDefer, pDelay, pMap, StringMap, _omit, _range } from '@naturalcycles/js-lib'
import { boldRed, dimGrey, yellow } from '@naturalcycles/nodejs-lib/dist/colors'
import * as fs from 'fs-extra'
import type { AddressInfo } from 'net'
import * as vega from 'vega'
import type { Spec } from 'vega'
import * as vegaLite from 'vega-lite'
import type { TopLevelSpec } from 'vega-lite'
import type {
  AutocannonResult,
  AutocannonSummary,
  HttpServerFactory,
  RunCannonNormalizedOptions,
  RunCannonOptions,
} from './cannon.model'

export async function runCannon(
  profiles: StringMap<HttpServerFactory>,
  optInput: RunCannonOptions = {},
): Promise<AutocannonSummary[]> {
  const opt: RunCannonNormalizedOptions = {
    name: 'Benchmark',
    reportDirPath: `./tmp/${optInput.name || 'Benchmark'}`,
    writePlots: true,
    writeSummary: true,
    ...optInput,
  }

  const { reportDirPath } = opt

  const resultByProfile: StringMap<AutocannonResult> = {}
  const summaries: AutocannonSummary[] = []

  for await (const profileName of Object.keys(profiles)) {
    resultByProfile[profileName] = await runCannonProfile(profileName, profiles[profileName]!, opt)
    const summary = toSummary(profileName, resultByProfile[profileName]!)
    if (!opt.includeLatencyPercentiles) {
      _omit(summary, ['latency50', 'latency90', 'latency99'], true)
    }
    summaries.push(summary)
  }

  console.table(summaries)

  if (opt.writeSummary) {
    const summaryJsonPath = `${reportDirPath}/${opt.name}.summary.json`
    fs.ensureDirSync(reportDirPath)
    fs.writeJsonSync(summaryJsonPath, summaries, { spaces: 2 })
    console.log(`saved ${dimGrey(summaryJsonPath)}`)
  }

  if (opt.writePlots) {
    await writePlotFiles(opt, summaries)
  }

  return summaries
}

async function runCannonProfile(
  profileName: string,
  serverFactory: HttpServerFactory,
  opt: RunCannonOptions = {},
): Promise<AutocannonResult> {
  let {
    runs = 2,
    connections = 100,
    pipelining = 10,
    duration = 40,
    cooldown = 3,
    host = 'http://localhost',
    renderProgressBar = true,
    renderResultsTable = true,
    renderLatencyTable = false,
    silent,
    verbose,
  } = opt
  if (silent) {
    renderProgressBar = false
    renderResultsTable = false
    renderLatencyTable = false
  } else if (verbose) {
    renderProgressBar = true
    renderResultsTable = true
    renderLatencyTable = true
  }

  const autocannon = require('autocannon')
  const server = await serverFactory()
  await new Promise<void>(resolve => server.listen(0, resolve))
  const { port } = server.address() as AddressInfo
  const url = `${host}:${port}`

  let finalResult: AutocannonResult = undefined as any

  for await (const run of _range(1, runs + 1)) {
    console.log(`\n${boldRed('=== ' + profileName + ' ===')} run ${yellow(run)}/${yellow(runs)}\n`)

    const doneDefer = pDefer<AutocannonResult>()

    const instance = autocannon(
      {
        url,
        connections,
        pipelining,
        duration,
      },
      (err: any, result: AutocannonResult) => {
        if (err) return doneDefer.reject(err)
        doneDefer.resolve(result)
      },
    )

    process.once('SIGINT', () => {
      if (instance) instance.stop()
    })

    autocannon.track(instance, {
      renderProgressBar,
      renderResultsTable,
      renderLatencyTable,
    })

    finalResult = await doneDefer

    if (!silent) console.log(dimGrey(`cooldown ${yellow(cooldown)} seconds...`))
    await pDelay(cooldown * 1000)
  }

  await new Promise(resolve => server.close(resolve))

  return finalResult
}

function toSummary(name: string, result: AutocannonResult): AutocannonSummary {
  return {
    name,
    rpsAvg: result.requests.average,
    latencyAvg: result.latency.average,
    latency50: result.latency.p50,
    latency90: result.latency.p90,
    latency99: result.latency.p99,
    throughputAvg: Number((result.throughput.average / 1024 / 1024).toFixed(2)),
    errors: result.errors,
    timeouts: result.timeouts,
  }
}

async function writePlotFiles(
  opt: RunCannonNormalizedOptions,
  summaries: AutocannonSummary[],
): Promise<void> {
  const { reportDirPath, name } = opt
  fs.ensureDirSync(reportDirPath)

  let fields = ['rpsAvg', 'latencyAvg', 'latency50', 'latency90', 'latency99', 'throughputAvg']
  if (!opt.includeLatencyPercentiles) {
    fields = fields.filter(f => !f.startsWith('latency') || f === 'latencyAvg')
  }

  const specs = autocannonSummaryToVegaSpecs(fields, summaries)

  await pMap(Object.keys(specs), async specName => {
    // create a new view instance for a given Vega JSON spec
    const view = new vega.View(vega.parse(specs[specName]!), { renderer: 'none' })

    // generate a static SVG image
    const svg = await view.toSVG()
    // console.log(svg)

    fs.writeFileSync(`${reportDirPath}/${name}.${specName}.svg`, svg)
  })

  fs.writeFileSync(`${reportDirPath}/${name}.md`, mdContent(opt, Object.keys(specs)))
}

function autocannonSummaryToVegaSpecs(
  fields: string[],
  summaries: AutocannonSummary[],
): StringMap<Spec> {
  // console.log(summary)

  const specs: StringMap<Spec> = {}

  fields.forEach(field => {
    const liteSpec: TopLevelSpec = {
      // title: 'title',
      // "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      data: {
        values: summaries,
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
          field,
          type: 'quantitative',
          axis: {
            title: field,
          },
        },
      },
    }

    const { spec } = vegaLite.compile(liteSpec)
    specs[field] = spec
  })

  return specs
}

function mdContent(opt: RunCannonNormalizedOptions, specNames: string[]): string {
  return [
    `# ${opt.name}`,
    opt.beforeText,
    specNames.map(specName => `![](./${opt.name}.${specName}.svg)`).join('\n'),
    opt.afterText,
  ]
    .filter(Boolean)
    .join('\n\n')
}
