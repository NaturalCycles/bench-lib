/*

yarn tsn demoCannon

 */

import { pDelay, _randomInt } from '@naturalcycles/js-lib'
import { expressFunctionFactory } from '../src/cannon.profiles'
import { runCannon } from '../src/cannon.util'

void runCannon(
  {
    noop: expressFunctionFactory(() => 'yo'),
    async: expressFunctionFactory(async () => await pDelay(0, 'yo')),
    random: expressFunctionFactory(() => _randomInt(1, 10)),
  },
  {
    // runs: 2,
    duration: 10,
    cooldown: 1,
    // silent: true,
    reportDirPath: './demo',
    // renderResultsTable: false,
    renderLatencyTable: false,
  },
)
