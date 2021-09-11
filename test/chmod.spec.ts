import { Parser } from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { mkdirAsync, rmdirAsync, statAsync, unlinkAsync, writeFileAsync } from 'libfsasync'

describe('chmod - failure cases', () => {
  it('non-existing-file', async () => {
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => caught = reason)
    const executor = parser.parse('741', 'non-existing-file')
    expect(caught).to.be.undefined
    executor.on('error', (reason: Error) => caught = reason)
    const err = await executor.executeAsync()
    expect(err).to.be.an.instanceOf(Error)
    expect(caught).to.be.an.instanceOf(Error)
    expect(err).to.be.eq(caught)
  })
})

describe('chmod - successful cases', () => {
  it('+x', async () => {
    await mkdirAsync('tmp1')
    for (const name of ['foo', 'bar'])
      await writeFileAsync(`tmp1/${name}`, name)
    await mkdirAsync('tmp1/baz')
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => caught = reason)
    const executor = parser.parse('+x', 'tmp1/foo', 'tmp1/bar', 'tmp1/baz')
    expect(caught).to.be.undefined
    executor.on('error', (reason: Error) => caught = reason)
    const err = await executor.executeAsync()
    expect(caught).to.be.undefined
    expect(err).not.to.be.an.instanceOf(Error)
    expect(err).to.be.true
    const stats = await statAsync('tmp1/foo')
    expect(stats).not.to.be.an.instanceOf(Error)
    if (!(stats instanceof Error))
      expect(stats.mode).to.be.eq(0o100755)
    await rmdirAsync('tmp1/baz')
    for (const name of ['foo', 'bar'])
      await unlinkAsync(`tmp1/${name}`)
    await rmdirAsync('tmp1')
  })
  it('-R +X', async () => {
    await mkdirAsync('tmp2')
    await mkdirAsync('tmp2/foo')
    await mkdirAsync('tmp2/foo/bar')
    await writeFileAsync('tmp2/foo/bar/baz', 'this is baz\n')
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => caught = reason)
    const executor = parser.parse('-R', '+X', 'tmp2')
    const success = await executor.executeAsync()
    expect(caught).to.be.undefined
    expect(success).to.be.true
    const bar = await statAsync('tmp2/foo/bar')
    expect(bar).not.to.be.an.instanceOf(Error)
    const baz = await statAsync('tmp2/foo/bar/baz')
    expect(baz).not.to.be.an.instanceOf(Error)
    if (!(bar instanceof Error || baz instanceof Error)) {
      expect(bar.mode).to.be.eq(0o040755)
      expect(baz.mode).to.be.eq(0o100644)
    }
    await unlinkAsync('tmp2/foo/bar/baz')
    await rmdirAsync('tmp2/foo/bar')
    await rmdirAsync('tmp2/foo')
    await rmdirAsync('tmp2')
  })
  it('a+wx', async () => {
    await mkdirAsync('tmp3')
    await writeFileAsync('tmp3/foo', '#!/bin/sh\necho this is foo\n')
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => caught = reason)
    const executor = parser.parse('a+wx', 'tmp3/foo')
    expect(caught).to.be.undefined
    executor.on('error', (reason: Error) => caught = reason)
    const err = await executor.executeAsync()
    expect(caught).to.be.undefined
    expect(err).not.to.be.an.instanceOf(Error)
    expect(err).to.be.true
    const stats = await statAsync('tmp3/foo')
    expect(stats).not.to.be.an.instanceOf(Error)
    if (!(stats instanceof Error))
      expect(stats.mode).to.be.eq(0o100777)
    await unlinkAsync('tmp3/foo')
    await rmdirAsync('tmp3')
  })
  it('u-r,g+w,o-x', async () => {
    await mkdirAsync('tmp4')
    await writeFileAsync('tmp4/foo', 'this is foo\n')
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => caught = reason)
    const executor = parser.parse('u-r,g+w,o-x', 'tmp4/foo')
    expect(caught).to.be.undefined
    executor.on('error', (reason: Error) => caught = reason)
    const err = await executor.executeAsync()
    expect(caught).to.be.undefined
    expect(err).not.to.be.an.instanceOf(Error)
    expect(err).to.be.true
    const stats = await statAsync('tmp4/foo')
    expect(stats).not.to.be.an.instanceOf(Error)
    if (!(stats instanceof Error))
      expect(stats.mode).to.be.eq(0o100264)
    await unlinkAsync('tmp4/foo')
    await rmdirAsync('tmp4')
  })
  it('o-r,o+w,o+x', async () => {
    await mkdirAsync('tmp5')
    await writeFileAsync('tmp5/foo', 'this is foo\n')
    const parser = new Parser()
    let caught: Error
    parser.on('error', (reason: Error) => caught = reason)
    const executor = parser.parse('o-r,o+w,o+x', 'tmp5/foo')
    expect(caught).to.be.undefined
    executor.on('error', (reason: Error) => caught = reason)
    const err = await executor.executeAsync()
    expect(caught).to.be.undefined
    expect(err).not.to.be.an.instanceOf(Error)
    expect(err).to.be.true
    const stats = await statAsync('tmp5/foo')
    expect(stats).not.to.be.an.instanceOf(Error)
    if (!(stats instanceof Error))
      expect(stats.mode).to.be.eq(0o100643)
    await unlinkAsync('tmp5/foo')
    await rmdirAsync('tmp5')
  })
})
