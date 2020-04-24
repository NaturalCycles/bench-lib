import { pDelay, _randomInt } from '@naturalcycles/js-lib'
import { BenchDeferredFunction } from './bench.model'

export const benchNoopFn: BenchDeferredFunction = done => done.resolve()

export const benchRandomFn: BenchDeferredFunction = done => {
  const _ = _randomInt(1, 10)
  done.resolve()
}

export const benchPDelayFn: BenchDeferredFunction = async done => {
  await pDelay()
  done.resolve()
}
