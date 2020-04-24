/*

yarn tsn cannon

 */

import { pDelay, _randomInt } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { expressFunctionFactory } from '../src/cannon.profiles'
import { runCannon } from '../src/cannon.util'

runScript(async () => {
  await runCannon(
    {
      // bareNode: bareNodeServerFactory,
      // bareExpress: bareExpressServerFactory,
      custom: expressFunctionFactory(() => 'yo'),
      customAsync: expressFunctionFactory(async () => await pDelay(0, 'yo')),
      rnd: expressFunctionFactory(() => _randomInt(1, 10)),
      // customAsync2: expressAsyncFunctionFactory(async () => 'yo'),
    },
    {
      // runs: 2,
      duration: 10,
      cooldown: 1,
      silent: true,
      // renderResultsTable: false,
      // renderLatencyTable: false,
    },
  )
})
