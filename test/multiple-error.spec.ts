/**
 * Import Node.js modules.
 */
import { describe, it } from 'mocha'
import { equal } from 'node:assert'

/**
 * Import library modules.
 */
import { statAsync, writeFileAsync } from 'libfsasync'

/**
 * Import local modules.
 */
import { isNodeJSErrnoException, MultipleError } from '../src'

describe('MultipleError', () => {
  it('is able to aggregate multiple errors', async () => {
    const err1 = await statAsync('non-existing-file')
    equal(err1 instanceof Error, true)
    equal(isNodeJSErrnoException(err1), true)
    const err2 = await writeFileAsync('/root/foo', 'this is foo\n')
    equal(err2 instanceof Error, true)
    equal(isNodeJSErrnoException(err2), true)
    const err3 = MultipleError.from([err1, err2])
    equal(err3 instanceof MultipleError, true)
    if (isNodeJSErrnoException(err3)) {
      equal(err3.code, 'ENOENT')
      equal(err3.errno, -2)
      equal(err3.path, 'non-existing-file')
      equal(err3.syscall, 'stat')
      for (const err of err3)
        equal(isNodeJSErrnoException(err), true)
      equal(`${err3}`, `${err1}\n\n${err2}`)
    }
  })
})
