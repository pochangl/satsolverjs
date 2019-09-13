import { ast } from '../ast'
import { toLogicTree, And, Or, Not, Atomic } from '../logic'
import { stringify } from '../test'

function check_tree(input: string, expected: string) {
  const treeAst = ast(input)
  const logicTree = toLogicTree(treeAst)
  const result = stringify(logicTree)
  expect(result).toEqual(expected)
}

describe('toLogicTree', () => {

  test('nested', () => {
    // random nested structure
    check_tree(
      'a or b implies not b and c or d',
      '((not (a or b)) or ((not b) and c) or d)'
    )
  })
})

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
      'a and b and c',
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
      'not a or b and c or d',
      '((not a) or (b and c) or d)'
    )
  })

  test('mixed \'and\' merge', () => {
    check_tree(
      'a and not b and c',
      '(a and (not b) and c)'
    )
  })
})
