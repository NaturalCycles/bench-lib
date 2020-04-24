import type * as http from 'http'

export type HttpServerFactory = () => Promise<http.Server>

export interface RunCannonOptions {
  /**
   * @default 2
   */
  runs?: number
  connections?: number
  pipelining?: number

  /**
   * seconds
   * @default 40
   */
  duration?: number

  /**
   * seconds
   * @default 3
   */
  cooldown?: number
  host?: string

  /**
   * @default undefined
   */
  silent?: boolean

  /**
   * @default undefined
   */
  verbose?: boolean

  /**
   * @default true
   */
  renderResultsTable?: boolean

  /**
   * @default true
   */
  renderProgressBar?: boolean

  /**
   * @default true
   */
  renderLatencyTable?: boolean

  /**
   * Name of this benchmark.
   * @default runCannon
   */
  name?: string

  /**
   * @default ./tmp/${name}
   */
  reportDirPath?: string

  /**
   * @default true
   * Set false to disable writing summary file.
   * Will write to ${reportDirPath}/${name}.summary.json
   */
  writeSummary?: boolean

  /**
   * @default true
   * Will write to ${reportDirPath}/${name}.${plotName}.svg
   */
  writePlots?: boolean
}

export interface AutocannonSummary {
  name: string
  rpsAvg: number
  latencyAvg: number
  latency50: number
  latency90: number
  latency99: number
  throughputAvg: number
  errors: number
  timeouts: number
}

export interface AutocannonResult {
  requests: {
    average: number
    [k: string]: number
  }
  latency: {
    average: number
    p50: number
    p90: number
    p99: number
    [k: string]: number
  }
  throughput: {
    average: number
    p50: number
    p90: number
    p99: number
    [k: string]: number
  }
  errors: number
  timeouts: number
}
