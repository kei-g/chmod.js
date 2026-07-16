#!/usr/bin/env node

import { Parser } from '../index.ts'
import { realpath } from 'node:fs/promises'

async function main(): Promise<void> {
  const realpaths = await Promise.all(
    process.argv.map(
      (argv: string) =>
        realpath(argv).catch(error => error)
    )
  )
  let i = realpaths.findIndex(
    (argv: NodeJS.ErrnoException | string) =>
      argv === import.meta.filename
  )
  if (i++ < 0)
    process.exit(1)
  const parser = new Parser()
  parser.on('error', reportError)
  const executor = parser.parse(...process.argv.slice(i))
  executor.on('error', reportError)
  await executor.executeAsync()
}

function reportError(reason: Error): never {
  console.error(reason.message)
  process.exit(1)
}

main()
