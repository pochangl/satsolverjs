import { combinations } from '@/utils/itertools'

describe('Itertools', () => {
  describe('combinations', () => {
    test('r = 2', () => {
      expect([
        ...combinations([1, 2, 3, 4], 2)
      ]).toEqual([
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ])
    })
  })
})
