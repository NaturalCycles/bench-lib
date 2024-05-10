import { _randomInt } from '@naturalcycles/js-lib'
import { BenchFunction } from './bench.model'

export const benchNoopFn: BenchFunction = () => {}

export const benchRandomFn: BenchFunction = () => {
  const _ = _randomInt(1, 10)
}
