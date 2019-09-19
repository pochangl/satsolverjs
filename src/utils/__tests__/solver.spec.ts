import { ast } from '../ast'
import { toCNF } from '../logic'
import { solve, toFact } from '../solver'

function check_solver(input: string, expected: string[]) {
  input = input.replace(/,/g, '\n')
  const treeAst = ast(input)
  const logicTree = toCNF(treeAst)
  const solutions = Array.from(solve(logicTree))
  const result = solutions.map(solution => toFact(solution.getTrueVars())).map(clause => clause.toString())

  expect(result.sort()).toEqual(expected.sort())
}

describe('solver', () => {
  test('a, a implies b', () => {
    check_solver(
      'a, a implies b',
      ['(a and b)'])
  })

  test('a, a implies b, b implies c, c implies d', () => {
    check_solver(
      'a, a implies b, b implies c, c implies d',
      ['(a and b and c and d)'])
  })

  test('b, a implies b, b implies c, c implies d', () => {
    check_solver(
      'b, a implies b, b implies c, c implies d',
      [
        '(b and c and d)',
        '(a and b and c and d)'
      ])
  })

  test('not a, b, a implies b, b implies c, c implies d', () => {
    check_solver(
      'not a, b, a implies b, b implies c, c implies d',
      [
        '(b and c and d)'
      ])
  })
})
