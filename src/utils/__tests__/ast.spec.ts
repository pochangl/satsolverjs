import { ast, IAbstractSyntaxTree } from '../ast'
import { precedence } from '../alias'

function stringify(tree: IAbstractSyntaxTree): string {
  if (tree.name === 'atomic')
    return tree.value as string
  else if (tree.name === 'not')
    return '(not ' + stringify(tree.clauses[0]) + ')'
  return '(' + tree.clauses.map(stringify).join(' ' + tree.name + ' ') + ')'
}

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
})

describe('ast nested', () => {
  test('implies/or', () => {
    check_ast(
      'a or b implies c or d',
      '((a or b) implies (c or d))'
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
      '(a and b)',
      '(a and b)'
    )
    check_ast(
      '( a implies b ) and (c implies d)',
      '((a implies b) and (c implies d))'
    )
    check_ast(
      '(a implies (b or e)) and (c implies d)',
      '((a implies (b or e)) and (c implies d))'
    )
  })


  test('complex', () => {
    check_ast(
      'a and b implies c or d and not e implies f',
      '((a and b) implies ((c or (d and (not e))) implies f))'
    )
  })
})
