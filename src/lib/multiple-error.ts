export class MultipleError extends Error implements Iterable<NodeJS.ErrnoException>, NodeJS.ErrnoException {
  static from(errors: unknown[]): MultipleError | false {
    const actually = errors.filter(isNodeJSErrnoException)
    return actually.length ? new MultipleError(actually) : false
  }

  private static getMessage(error: NodeJS.ErrnoException): string {
    return error.message
  }

  private constructor(
    private readonly errors: NodeJS.ErrnoException[]
  ) {
    super(errors.map(MultipleError.getMessage).join('\n'))
  }

  get code(): string {
    return this.errors[0].code
  }

  get errno(): number {
    return this.errors[0].errno
  }

  get path(): string {
    return this.errors[0].path
  }

  get syscall(): string {
    return this.errors[0].syscall
  }

  [Symbol.iterator](): Iterator<NodeJS.ErrnoException> {
    return this.errors[Symbol.iterator]()
  }

  [Symbol.toPrimitive](): string {
    return this.errors.map(
      (err: NodeJS.ErrnoException) => err.toString()
    ).join('\n\n')
  }
}

export const isNodeJSErrnoException = (value: unknown): value is NodeJS.ErrnoException => {
  const error = value as NodeJS.ErrnoException
  if (value instanceof Error) {
    const score = +(typeof error.code === 'string') * 16
      + +(typeof error.errno === 'number') * 8
      + +(typeof error.message === 'string') * 4
      + +(typeof error.path === 'string') * 2
      + +(typeof error.syscall === 'string')
    return score === 31
  }
  return false
}
