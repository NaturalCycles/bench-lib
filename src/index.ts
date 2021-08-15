import { BenchDeferredFunction, HertzMap, RunBenchOptions } from './bench.model'
import { benchNoopFn } from './bench.profles'
import { runBench } from './bench.util'
import {
  AutocannonOptions,
  AutocannonResult,
  AutocannonSummary,
  HttpServerFactory,
  RunCannonOptions,
} from './cannon.model'
import {
  bareExpressServerFactory,
  bareNodeServerFactory,
  expressFunctionFactory,
  expressWithMiddlewaresServerFactory,
} from './cannon.profiles'
import { runCannon } from './cannon.util'

export type {
  RunBenchOptions,
  BenchDeferredFunction,
  HertzMap,
  HttpServerFactory,
  RunCannonOptions,
  AutocannonSummary,
  AutocannonResult,
  AutocannonOptions,
}

export {
  runBench,
  benchNoopFn,
  runCannon,
  bareNodeServerFactory,
  bareExpressServerFactory,
  expressWithMiddlewaresServerFactory,
  expressFunctionFactory,
}
