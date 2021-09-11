/**
 * Import Node.js modules.
 */
import { describe, it } from 'mocha'
import { expect } from 'chai'

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
    expect(err1).to.be.an.instanceOf(Error)
    expect(err1).to.satisfy(isNodeJSErrnoException)
    const err2 = await writeFileAsync('/root/foo', 'this is foo\n')
    expect(err2).to.be.an.instanceOf(Error)
    expect(err2).to.satisfy(isNodeJSErrnoException)
    const err3 = MultipleError.from([err1, err2])
    expect(err3).to.be.an.instanceOf(MultipleError)
    if (isNodeJSErrnoException(err3)) {
      expect(err3.code).to.be.eq('ENOENT')
      expect(err3.errno).to.be.eq(-2)
      expect(err3.path).to.be.eq('non-existing-file')
      expect(err3.syscall).to.be.eq('stat')
      for (const err of err3)
        expect(err).to.satisfy(isNodeJSErrnoException)
      expect(`${err3}`).to.be.eq(`${err1}\n\n${err2}`)
    }
  })
})
