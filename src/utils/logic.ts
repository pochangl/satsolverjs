import { IAbstractSyntaxTree } from './ast'
import { createTempVar } from './variables'

declare type ILogicTransformer = (ast: IAbstractSyntaxTree, clauses: Array<Logic>) => Logic

declare type ICNF = Array<Array<string>>

interface ILogics {
  [key: string]: ILogicTransformer
}


abstract class Logic implements IAbstractSyntaxTree {
  /*
    logic class for handling logic operation
  */

  // merging similar logic
  public abstract merge(): Logic

  // for checking validity
  public abstract isValid(): boolean

  // for debugging purpose
  public abstract name: string

  clauses: Array<Logic>
  value?: string

  constructor(clauses: Array<Logic>, value?: string) {
    this.clauses = clauses
    this.value = value
  }

  runValidation() {
    // raise error if invalid
    if (!this.isValid()) {
      throw new Error('invalid state')
    }
  }
  runMerge(): Logic {
    // merge logic
    this.clauses = this.clauses.map(clause => clause.merge())
    return this.merge()
  }
}

export class Atomic extends Logic {
  name = 'atomic'
  isValid() {
    return this.clauses.length === 0 && !!this.value
  }
  merge() {
    /*
      atomic is the most basic element
      nothing to merge
    */
    return this
  }
}

export class Not extends Logic {
  name = 'not'
  isValid() {
    return this.clauses.length === 1
  }
  merge(): Logic {
    /*
      merge not logic
      for example:
        not not b => b
    */
    if (this.clauses[0] instanceof Not) {
      return this.clauses[0].clauses[0]
    }
    return this
  }
}

export class Or extends Logic {
  name = 'or'
  isValid() {
    return this.clauses.length >= 2
  }
  merge(): Logic {
    /*
      merge or logic
      for example:
        a or (b or c) => (a or b or c)
    */
    for (const clause of this.clauses) {
      if (clause instanceof Or) {
        this.clauses = [
          ...this.clauses,
          ...clause.clauses
        ]
      }
    }
    this.clauses = this.clauses.filter(clause => !(clause instanceof Or))
    return this
  }
}

export class And extends Logic {
  name = 'and'
  isValid() {
    return this.clauses.length >= 2
  }
  merge(): Logic {
    /*
      merge and logic
      for example:
        a and (b and c) => (a and b and c)
    */
    for (const clause of this.clauses) {
      if (clause instanceof And) {
        this.clauses = [
          ...this.clauses,
          ...clause.clauses
        ]
      }
    }
    this.clauses = this.clauses.filter(clause => !(clause instanceof And))
    return this
  }
}

const logics: ILogics = {
  atomic(ast) {
    return new Atomic([], ast.value)
  },
  not(ast, clauses) {
    return new Not(clauses)
  },
  implies(ast, clauses) {
    const [left, right] = clauses
    return new Or([
      new Not([left]),
      right
    ])
  },
  and(ast, clauses) {
    return new And(clauses)
  },
  or(ast, clauses) {
    return new Or(clauses)
  }
}

function logicfy(ast: IAbstractSyntaxTree): Logic {
  /*
    ast node to logic structure
  */
  const op = logics[ast.name]
  return op(
    ast,
    ast.clauses.map(logicfy)
  )
}

export function toLogicTree(ast: IAbstractSyntaxTree): Logic {
  /*
    make ast to logic tree and merge its structure
    merge structure example:
      example1
        a and (b and c) => a and b and c
      example2
        not not c => c
  */
  const tree = logicfy(ast).runMerge()
  tree.runValidation()
  return tree
}
