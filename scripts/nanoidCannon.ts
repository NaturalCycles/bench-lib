/*

yarn tsn nanoidCannon

 */

import { nanoid } from '@naturalcycles/nodejs-lib'
import { expressFunctionFactory, expressSyncFunctionFactory } from '../src/cannon.profiles'
import { runCannonScript } from '../src'
const { nanoid: nanoidAsync } = require('nanoid/async')

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
