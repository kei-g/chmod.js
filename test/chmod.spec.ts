import { Parser } from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { mkdirAsync, rmdirAsync, unlinkAsync, writeFileAsync } from 'libfsasync'

describe('chmod', () => {
  it('successfully', async () => {
    await mkdirAsync('tmp')
    for (const name of ['foo', 'bar', 'baz'])
      await writeFileAsync(`tmp/${name}`, name)
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => {
      console.log(reason)
      caught = reason
    })
    const executor = parser.parse('+x', 'tmp/foo', 'tmp/bar', 'tmp/baz')
    expect(caught).to.be.undefined
    executor.on('error', (reason: Error) => {
      console.log(reason)
      caught = reason
    })
    const err = await executor.executeAsync()
    for (const name of ['foo', 'bar', 'baz'])
      await unlinkAsync(`tmp/${name}`)
    await rmdirAsync('tmp')
    expect(caught).to.be.undefined
    expect(err).to.not.be.an.instanceOf(Error)
    expect(err).to.be.true
  })
})
