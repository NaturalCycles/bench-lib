export interface BenchDeferred {
  resolve(): void
}

export type BenchDeferredFunction = (defer: BenchDeferred) => any

export interface RunBenchOptions {
  fns?: Record<string, BenchDeferredFunction>

  /**
   * @default 1
   * Every second run will be in reverse order
   */
  runs?: number

  /**
   * Name of this benchmark.
   * @default runBench
   */
  name?: string

  /**
   * @default ./tmp/${name}
   */
  reportDirPath?: string

  /**
   * @default false
   * Set false to disable writing summary file.
   * Will write to ${reportDirPath}/${name}.json
   */
  writeSummary?: boolean

  /**
   * @default false
   * Will write to ${reportDirPath}/${name}.svg
   */
  writePlot?: boolean
}

/**
 * results[fnName] = 100 // ops/sec, or "hertz"
 */
export type HertzMap = Record<string, number>
