import { ast } from '../ast'
import { toLogicTree } from '../logic'
import { stringify } from '../test'

function check_tree(input: string, expected: string) {
  const treeAst = ast(input)
  const logicTree = toLogicTree(treeAst)
  const result = stringify(logicTree)
  expect(result).toEqual(expected)
}

describe('toLogicTree merging', () => {
  test('pure imply merge', () => {
    check_tree(
      'a implies b implies c',
      '((not a) or (not b) or c)'
    )
  })
  test('pure \'or\' merge', () => {
    check_tree(
      'a or b or c',
      '(a or b or c)'
    )
  })

  test('pure \'and\' merge', () => {
    check_tree(
      'a \n b \n c',
      '(a and b and c)'
    )
  })

  test('pure \'not\' merge', () => {
    check_tree(
      'not not a',
      'a'
    )
  })

  test('mixed \'implies\' merge', () => {
    check_tree(
      'a or b implies c or d',
      '((not (a or b)) or c or d)'
    )
  })

  // nested
  test('mixed \'or\' merge', () => {
    check_tree(
      'not a or b or ( c or not d)',
      '((not a) or b or c or (not d))'
    )
  })

  test('mixed \'and\' merge', () => {
    check_tree(
      'a \n not b \n d or e \n f implies g',
      '(a and (not b) and (d or e) and ((not f) or g))'
    )
  })
})
