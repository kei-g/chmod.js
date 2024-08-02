/**
 * Import Node.js modules.
 */
import type { Dirent, Stats } from 'fs'
import { EventEmitter } from 'stream'
import { readdir } from 'fs/promises'

/**
 * Import library modules.
 */
import { chmodAsync, lstatAsync } from 'libfsasync'

/**
 * Import local modules.
 */
import { MultipleError } from '.'
import { join } from 'path'

export interface AsyncExecutable {
  executeAsync(): Promise<NodeJS.ErrnoException | true>
  on(_eventName: 'error', _listener: (_reason: Error) => void): AsyncExecutable
}

type BoundedFunction =
  () => Promise<NodeJS.ErrnoException | true>

class Executor implements AsyncExecutable {
  readonly #eventEmitter = new EventEmitter()
  private readonly functions: BoundedFunction[]

  constructor(functions: BoundedFunction[]) {
    this.functions = functions
  }

  async executeAsync(): Promise<NodeJS.ErrnoException | true> {
    for (const func of this.functions) {
      const err = await func()
      if (err instanceof Error) {
        this.#eventEmitter.emit('error', err)
        return err
      }
    }
    return true
  }

  on(eventName: 'error', listener: (_reason: Error) => void): Executor {
    this.#eventEmitter.on(eventName, listener)
    return this
  }
}

type Mapper = (_oct: OctalDigit) => number

type ModeCharacter = ValueOf<Pick<Octal | RWX, 'char'>>

type Modifier = (_previousMode: number, _stats: Stats) => number

type Octal = {
  char: '0'
  digit: 0
} | {
  char: '1'
  digit: 1
} | {
  char: '2'
  digit: 2
} | {
  char: '3'
  digit: 4
} | {
  char: '4'
  digit: 4
} | {
  char: '5'
  digit: 5
} | {
  char: '6'
  digit: 6
} | {
  char: '7'
  digit: 7
}

type OctalDigit = ValueOf<Pick<Octal, 'digit'>>

export class Parser {
  readonly #eventEmitter = new EventEmitter()
  readonly #functions = [] as BoundedFunction[]

  on(eventName: 'error', listener: (_reason: Error) => void): this {
    this.#eventEmitter.on(eventName, listener)
    return this
  }

  parse(...args: string[]): AsyncExecutable {
    const ee = this.#eventEmitter
    const req = new ParsedRequest(ee.emit.bind(ee, 'error'))
    for (let i = 0; i < args.length;) {
      const arg = args[i++]
      if (arg === '-R' || arg === '--recursive')
        req.recursive = true
      else if (req.modifiers === undefined)
        req.set(arg)
      else
        this.#functions.push(bind(req.modifiers, arg, req.recursive))
    }
    return new Executor(this.#functions)
  }
}

class ParsedRequest {
  static #create(execution: number, permission: string, sticky: number, target: string) {
    return (stats: Stats) => {
      let umask = umaskOf(permission, target)
      if (permission.includes('X') && stats.isDirectory())
        umask |= execution
      if (permission.includes('s'))
        umask |= sticky
      if (permission.includes('t'))
        umask |= 0o1000
      return umask
    }
  }

  static #process(operand: string | undefined, umask: number) {
    return (mode: number) => {
      switch (operand) {
        case '+':
          return mode | umask
        case '-':
          return mode & ~umask
        case '=':
        case undefined:
          return umask
      }
    }
  }

  readonly #claim: (_error: Error) => void
  modifiers?: Modifier[]
  recursive?: true

  constructor(claim: (_error: Error) => void) {
    this.#claim = claim
  }

  set(arg: string) {
    for (const mode of arg.matchAll(modeRE)) {
      const {
        target,
        op1,
        perm,
        op2,
        oct,
      } = mode.groups
      const permission = coalesce(perm, oct)
      const operand = [op1, op2][+(perm === undefined)]
      const score = +(permission === undefined) * 8
        + +(perm !== undefined) * 4
        + +(op1 === undefined) * 2
        + +(target === undefined)
      if ([5, 6, 8].includes(score)) {
        this.#claim(new Error(`invalid argument '${arg}'`))
        continue
      }
      const execution = {
        'a': 0o111,
        '': 0o111,
        'g': 0o010,
        'o': 0o001,
        'u': 0o100,
      }[target]
      const sticky = {
        'a': 0o6000,
        '': 0o6000,
        'g': 0o4000,
        'u': 0o2000,
      }[target]
      const f1 = ParsedRequest.#create(execution, permission, sticky, target)
      const f2 = (umask: number) => ParsedRequest.#process(operand, umask)
      const f = (mode: number, stats: Stats) => f2(f1(stats))(mode)
      this.modifiers?.push(f) ?? (this.modifiers = [f])
    }
  }
}

type RWX = {
  char: 'r'
  digit: 4
} | {
  char: 'w'
  digit: 2
} | {
  char: 'x'
  digit: 1
}

type ValueOf<T> =
  T extends Record<string | number | symbol, infer V>
  ? V
  : never

const bind = (
  modifiers: Modifier[],
  path: string,
  recursive?: true,
): BoundedFunction =>
  () =>
    chmodRecursiveAsync(
      modifiers,
      path,
      recursive,
    )

const chmodForDirent = async (modifiers: Modifier[], path: string) => (dir: Dirent) => chmodRecursiveAsync(modifiers, join(path, dir.name))

const chmodRecursiveAsync = async (modifiers: Modifier[], path: string, recursive?: true): Promise<NodeJS.ErrnoException | true> => {
  const stats = await lstatAsync(path)
  if (stats instanceof Error)
    return stats
  const score = +stats.isDirectory() * 2 + +recursive
  if (score === 3) {
    const dirs = await readdir(path, { withFileTypes: true, recursive: true }).catch(passThrough)
    if (isNodeJsErrnoException(dirs))
      return dirs
    const error = MultipleError.from(await Promise.all(dirs.map(chmodForDirent.bind(this, modifiers, path))))
    if (error)
      return error
  }
  return await chmodAsync(
    path,
    modifiers.reduce(
      (previousMode: number, modifier: Modifier) => modifier(previousMode, stats),
      stats.mode,
    )
  )
}

const coalesce = <T, U>(arg1: T | null | undefined, arg2: U) => arg1 ?? arg2

const isModeCharacter = (value: unknown): value is ModeCharacter =>
  typeof value === 'string'
  && (
    ['r', 'w', 'x'].includes(value)
    || ('0' <= value && value <= '7')
  )

const isNodeJsErrnoException = (value: unknown): value is NodeJS.ErrnoException => {
  const error = value as NodeJS.ErrnoException
  if (value instanceof Error) {
    const score = +(typeof error.code === 'string') * 16
      + +(typeof error.errno === 'number') * 8
      + +(typeof error.message === 'string') * 4
      + +(typeof error.path === 'string') * 2
      + +(typeof error.syscall === 'string')
    return score === 31
  }
}

const mapperFromTarget = (target: string): Mapper => {
  console.assert(typeof target === 'string', `mapperFromTarget: 'target' must be a string, but ${typeof target}`)
  console.assert(target.length <= 1, `mapperFromTarget: 'target.length' must be less than 2, but ${target.length}`)
  const map = {
    'a': (oct: OctalDigit) => oct << 6 | oct << 3 | oct,
    '': (oct: OctalDigit) => oct << 6 | oct << 3 | oct,
    'g': (oct: OctalDigit) => oct << 3,
    'o': (oct: OctalDigit) => oct,
    'u': (oct: OctalDigit) => oct << 6,
  }
  console.assert(target in map, `mapperFromTarget: ${target} must be in 'map'`)
  return map[target as keyof typeof map]
}

const modeRE = /(?<target>[ugoa]*)((?<op1>[-+=])(?<perm>[Xrstwx]*|[ugo]))+|(?<op2>[-+=])?(?<oct>[0-7]+)/g
Object.freeze(modeRE)

const octalMap = {
  'r': 4,
  'w': 2,
  'x': 1,
} as Record<ModeCharacter, OctalDigit>

const octalNumberFrom = (permissionDigit: ModeCharacter): OctalDigit => {
  console.assert(typeof permissionDigit === 'string', `octalNumberFrom: 'permissionDigit' must be a string, but ${typeof permissionDigit}`)
  console.assert(permissionDigit.length === 1, `octalNumberFrom: 'permissionDigit.length' must be 1, but ${permissionDigit.length}`)
  if (!Object.isFrozen(octalMap)) {
    for (let i = 0; i < 8; i++)
      octalMap[i.toString() as ModeCharacter] = i as OctalDigit
    Object.freeze(octalMap)
  }
  console.assert(permissionDigit in octalMap, `octalNumberFrom: ${permissionDigit} must be in 'octalMap'`)
  return octalMap[permissionDigit]
}

const passThrough = <T>(value: T) => value

const umaskOf = (permission: string, target: string): number => {
  console.assert(typeof permission === 'string', `umaskOf: 'permission' must be a string, but ${typeof permission}`)
  console.assert(typeof target === 'string', `umaskOf: 'target' must be a string, but ${typeof target}`)
  const mapper = mapperFromTarget(target)
  console.assert(typeof mapper === 'function', `umaskOf: 'mapper' must be a function, but ${typeof mapper}`)
  return permission.split('')
    .filter(isModeCharacter)
    .map(octalNumberFrom)
    .reduce(
      (previous: number, mask: OctalDigit) =>
        previous | mapper(mask),
      0,
    )
}
