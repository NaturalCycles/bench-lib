/*

yarn tsn nanoidCannon

 */

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { nanoid } from 'nanoid'
import { nanoid as nanoidAsync } from 'nanoid/async'
import { expressFunctionFactory, expressSyncFunctionFactory } from '../src/cannon.profiles'
import { runCannon } from '../src/cannon.util'

runScript(async () => {
  await runCannon(
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
})
