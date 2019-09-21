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
        '(((not a) or (not b) or c))'
      )
    })

    test('or', () => {
      check_tree(
        'a or b or c',
        '((a or b or c))'
      )
    })

    test('and', () => {
      check_tree(
        'a \n b and c',
        '((a) and (b) and (c))'
      )
    })

    test('not', () => {
      check_tree(
        'not not a',
        '((a))'
      )
    })
    test('a', () => {
      check_tree(
        'a',
        '((a))'
      )
    })
  })

  describe('simplify', () => {
    // nested
    test('case1', () => {
      check_tree(
        'not a or b or ( c or not d)',
        '(((not a) or b or c or (not d)))'
      )
    })
    test('case2', () => {
      check_tree(
        'not (a and b) \n not b or e \n f implies g',
        '(((not a) or (not b)) and ((not b) or e) and ((not f) or g))'
      )
    })
  })
  describe('logic chain', () => {

    test('case3', () => {
      check_tree(
        'not a \n b \n a implies b \n b implies c \n c implies d',
        '(((not a)) and (b) and ((not a) or b) and ((not b) or c) and ((not c) or d))'
      )
    })
    test('case4', () => {
      check_tree(
        'a or b or c or d or e or f or g',
        '((a or b or c or d or e or f or g))'
      )
    })
    test('case5', () => {
      check_tree(
        'not not not not not not not a',
        '(((not a)))'
      )
    })
    test('case6', () => {
      check_tree(
        'a \n b \n c \n d \n a or b or c or d or not not not not a',
        '((a) and (b) and (c) and (d) and (a or b or c or d or a))'
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

  describe('existential', () => {
    test('at least', () => {
      check_tree(
        'at least 1 of {a, b, c}',
        '((a or b or c))'
      )
    })
    test('at most', () => {
      check_tree(
        'at most 1 of {a, b, c}',
        '(((not a) or (not b)) and ((not a) or (not c)) and ((not b) or (not c)))'
      )
    })

    test('at most out of 4', () => {
      check_tree(
        'at most 1 of {a, b, c, d}',
        '(((not a) or (not b)) and ((not a) or (not c)) and ((not a) or (not d)) and ((not b) or (not c)) and ((not b) or (not d)) and ((not c) or (not d)))'
      )
    })

    test('only 1 of', () => {
      check_tree(
        'only 1 of {a, b, c}',
        '((a or b or c) and ((not a) or (not b)) and ((not a) or (not c)) and ((not b) or (not c)))'
      )
    })
  })
})
