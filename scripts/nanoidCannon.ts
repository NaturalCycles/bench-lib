/*

yarn tsn nanoidCannon

 */

import { nanoid } from 'nanoid'
import { nanoid as nanoidAsync } from 'nanoid/async'
import { expressFunctionFactory, expressSyncFunctionFactory } from '../src/cannon.profiles'
import { runCannonScript } from '../src'

runCannonScript(
  {
    nanoidSync: expressSyncFunctionFactory(() => nanoid()),
    nanoidAsync: expressFunctionFactory(() => nanoidAsync()),
  },
  {
    runs: 2,
    duration: 4,
    cooldown: 1,
  },
)
