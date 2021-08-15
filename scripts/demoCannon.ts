/*

yarn tsn demoCannon

 */

import { pDelay, _randomInt } from '@naturalcycles/js-lib'
import { expressFunctionFactory } from '../src'
import { runCannon } from '../src'

void runCannon(
  {
    noop: expressFunctionFactory(() => 'yo'),
    async: expressFunctionFactory(async () => await pDelay(0, 'yo')),
    random: expressFunctionFactory(() => _randomInt(1, 10)),
  },
  {
    name: 'runCannon',
    beforeText: 'Some **text** before',
    afterText: `That's all folks`,
    // runs: 2,
    // duration: 10,
    duration: 2,
    cooldown: 1,
    // silent: true,
    reportDirPath: './demo',
    // renderResultsTable: false,
    renderLatencyTable: false,
  },
)
