import { ast } from '../ast'
import { stringify } from '../humanize'

function check_ast(input: string, expected: string) {
  const tree = ast(input)
  const result = stringify(tree)
  expect(result).toEqual(expected)
}

describe('ast basic', () => {
  it('should handles 2 clauses', () => {
    check_ast(
      'a implies b',
      '(a implies b)'
    )
  })
})

describe('weird', () => {
  check_ast(
    'a implies b\n\n',
    '(a implies b)'
  )
})

describe('ast nested', () => {

  test('and/imply', () => {
    check_ast(
      'a implies b \n c implies d',
      '((a implies b) and (c implies d))'
    )
  })

  test('implies/iff', () => {
    check_ast(
      'a iff b implies c iff d',
      '((a iff b) implies (c iff d))'
    )
  })

  test('iff/or', () => {
    check_ast(
      'a or b iff c or d',
      '((a or b) iff (c or d))'
    )
  })

  test('or/and', () => {
    check_ast(
      'a and b or c and d',
      '((a and b) or (c and d))'
    )
  })

  test('and/not', () => {
    check_ast(
      'not a and not b',
      '((not a) and (not b))'
    )
  })

  test('clause', () => {
    check_ast(
      '(a implies b)',
      '(a implies b)'
    )
    check_ast(
      '( a implies b ) or (c implies d)',
      '((a implies b) or (c implies d))'
    )
    check_ast(
      '(a implies (b or e)) or (c implies d)',
      '((a implies (b or e)) or (c implies d))'
    )
  })

  test('complex', () => {
    check_ast(
      'a \n b implies c or d \n not e implies f',
      '(a and ((b implies (c or d)) and ((not e) implies f)))'
    )
  })
})

describe('Atomic', () => {
  it('should handles 1 clauses', () => {
    // prefix
    check_ast(
      'not a',
      '(not a)'
    )
  })

  it('should handles atomic', () => {
    check_ast('b', 'b')
  })

  test('at least', () => {
    check_ast(
      'at least 1 of {a, b, c}',
      '(at least a b c)'
    )
  })
  test('at most', () => {
    check_ast(
      'at most 1 of {a, b, c}',
      '(at most a b c)'
    )
  })
  test('only 1 of', () => {
    check_ast(
      'only 1 of {a, b, c}',
      '(one a b c)'
    )
  })
})
