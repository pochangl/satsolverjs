import { ast } from '../ast'
import { toCNF, CNFError } from '../logic'

function check_tree(input: string, expected: string) {
  const treeAst = ast(input)
  const logicTree = toCNF(treeAst)
  const result = logicTree.toString()
  expect(result).toEqual(expected)
}

function non_cnf_tree(input: string) {
  expect(() => {
    const treeAst = ast(input)
    const logicTree = toCNF(treeAst)
    const result = logicTree.toString()
    throw new Error(result)
  }).toThrow(CNFError)
}

describe('toLogicTree merging', () => {
  describe('pure', () => {
    test('imply', () => {
      check_tree(
        'a implies b implies c',
        '((not a) or (not b) or c)'
      )
    })

    test('or', () => {
      check_tree(
        'a or b or c',
        '(a or b or c)'
      )
    })

    test('and', () => {
      check_tree(
        'a \n b and c',
        '(a and b and c)'
      )
    })

    test('not', () => {
      check_tree(
        'not not a',
        'a'
      )
    })
  })

  describe('simplify', () => {
    // nested
    test('case1', () => {
      check_tree(
        'not a or b or ( c or not d)',
        '((not a) or b or c or (not d))'
      )
    })
    test('case2', () => {
      check_tree(
        'not (a and b) \n not b or e \n f implies g',
        '(((not a) or (not b)) and ((not b) or e) and ((not f) or g))'
      )
    })
  })

  describe('not Conjunction Normal Form', () => {
    test('mixed \'and\' merge', () => {
      non_cnf_tree('a \n not b and d or e \n f implies g')
    })
    test('disjunction normal form', () => {
      non_cnf_tree('not b and d or e')
    })

    test('mixed \'implies\' merge', () => {
      non_cnf_tree('a or b implies c')
    })
  })
})
