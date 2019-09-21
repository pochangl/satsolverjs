import { contextmanager } from '@/utils/contextlib'

describe('contextlib', () => {
  test('execution order', () => {
    const pipe: number[] = []

    const manager = contextmanager((exec) => {
      pipe.push(1)
      exec()
      pipe.push(3)
    })

    const func = manager(() => {
      pipe.push(2)
      return 9
    })

    expect(pipe).toEqual([])
    const value = func()
    expect(value).toBe(9)
    expect(pipe).toEqual([1, 2, 3])
  })

  test('should handles async as well', async () => {
    const pipe: number[] = []

    const manager = contextmanager(async (exec) => {
      pipe.push(1)
      await exec()
      pipe.push(3)
    })

    const func = manager(() => {
      pipe.push(2)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(9)
        }, 10)
      })
    })

    expect(pipe).toEqual([])
    const val = await func()
    expect(val).toBe(9)
    expect(pipe).toEqual([1, 2, 3])
  })

  test('exception handling', () => {
    const pipe: number[] = []
    class MyError extends Error { }

    const manager = contextmanager((exec) => {
      pipe.push(1)
      expect(() => {
        exec()
      }).toThrow(MyError)

      pipe.push(3)
    })

    const func = manager(() => {
      throw new MyError()
      pipe.push(2)
    })

    expect(pipe).toEqual([])
    func()
    expect(pipe).toEqual([1, 3])
  })

  test('async exception handling', async () => {
    const pipe: number[] = []
    class MyError extends Error { }

    const manager = contextmanager(async (exec) => {
      pipe.push(1)
      await exec()
      pipe.push(3)
    })

    const func = manager(async () => {
      throw new MyError()
      pipe.push(2)
    })

    expect(pipe).toEqual([])
    await expect(func()).rejects.toThrow(MyError)

    expect(pipe).toEqual([1, 3])
  })

  test('\'this\' key word should work inside manager', () => {
    const manager = contextmanager(function (exec) {
      this.managerValue = 'mvalue'
      exec()
    })

    class Cls {
      test = 3
      managerValue: string
      value: number
      @manager
      f() {
        this.value = 9
      }
    }
    const obj = new Cls()
    expect(obj.value).toBe(undefined)
    expect(obj.managerValue).toBe(undefined)
    obj.f()
    expect(obj.value).toBe(9)
    expect(obj.managerValue).toBe('mvalue')
  })

  test('class method handling', () => {
    const pipe: number[] = []

    const manager = contextmanager((exec) => {
      pipe.push(1)
      exec()
      pipe.push(3)
    })

    class Cls {
      @manager
      f() {
        pipe.push(2)
        return 9
      }
    }

    expect(pipe).toEqual([])
    const value = (new Cls()).f()
    expect(value).toBe(9)
    expect(pipe).toEqual([1, 2, 3])
  })
})
