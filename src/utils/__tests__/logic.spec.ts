import { ast } from '../ast'
import { toLogicTree, And, Or, Not, Atomic } from '../logic'

describe('toLogicTree', () => {

  test('nested', () => {
    // random nested structure
    const treeAst = ast('a or b implies not b and c or d')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toMatchObject(
      new Or([
        new Not([
          new Or([
            new Atomic([], 'a'),
            new Atomic([], 'b'),
          ])
        ]),
        new And([
          new Not([
            new Atomic([], 'b'),
          ]),
          new Atomic([], 'c'),
        ]),
        new Atomic([], 'd'),
      ])
    )
  })
})

describe('toLogicTree merging', () => {
  test('pure imply merge', () => {
    const treeAst = ast('a implies b implies c')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toEqual(
      new Or([
        new Not([
          new Atomic([], 'a'),
        ]),
        new Not([
          new Atomic([], 'b'),
        ]),
        new Atomic([], 'c'),
      ])
    )
  })
  test('pure \'or\' merge', () => {
    const treeAst = ast('a or b or c')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toEqual(
      new Or([
        new Atomic([], 'a'),
        new Atomic([], 'b'),
        new Atomic([], 'c'),
      ])
    )

  })

  test('pure \'and\' merge', () => {
    const treeAst = ast('a and b and c')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toEqual(
      new And([
        new Atomic([], 'a'),
        new Atomic([], 'b'),
        new Atomic([], 'c'),
      ])
    )
  })

  test('pure \'not\' merge', () => {
    const treeAst = ast('not not a')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toEqual(new Atomic([], 'a'))
  })

  test('mixed \'implies\' merge', () => {
    const treeAst = ast('a or b implies c or d')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toEqual(
      new Or([
        new Not([
          new Or([
            new Atomic([], 'a'),
            new Atomic([], 'b'),
          ])
        ]),
        new Atomic([], 'c'),
        new Atomic([], 'd'),
      ])
    )
  })

  // nested
  test('mixed \'or\' merge', () => {
    const treeAst = ast('not a or b and c or d')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toMatchObject(
      new Or([
        new Not([
          new Atomic([], 'a')
        ]),
        new And([
          new Atomic([], 'b'),
          new Atomic([], 'c')
        ]),
        new Atomic([], 'd'),
      ])
    )
  })

  test('mixed \'and\' merge', () => {
    const treeAst = ast('a and not b and c')
    const logicTree = toLogicTree(treeAst)
    expect(logicTree).toMatchObject(
      new And([
        new Atomic([], 'a'),
        new Not([
          new Atomic([], 'b'),
        ]),
        new Atomic([], 'c'),
      ])
    )
  })
})
