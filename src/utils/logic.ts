import { IAbstractSyntaxTree } from './ast'
import { createTempVar } from './variables'

declare type ILogicTransformer = (ast: IAbstractSyntaxTree, clauses: Array<Logic>) => Logic

declare type ICNF = Array<Array<string>>

interface ILogics {
  [key: string]: ILogicTransformer
}


abstract class Logic {
  // merging similar logic
  public abstract merge(): Logic

  // for checking validity
  public abstract isValid(): boolean

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
  isValid() {
    return this.clauses.length === 0 && !!this.value
  }
  merge() {
    return this
  }
}

export class Not extends Logic {
  isValid() {
    return this.clauses.length === 1
  }
  merge(): Logic {
    if (this.clauses[0] instanceof Not) {
      return this.clauses[0].clauses[0]
    }
    return this
  }
}

export class Or extends Logic {
  isValid() {
    return this.clauses.length >= 2
  }
  merge(): Logic {
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
  isValid() {
    return this.clauses.length >= 2
  }
  merge(): Logic {
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
  const op = logics[ast.name]
  return op(
    ast,
    ast.operands.map(logicfy)
  )
}

export function toLogicTree(ast: IAbstractSyntaxTree): Logic {
  const tree = logicfy(ast)
  tree.runValidation()
  return tree.runMerge()
}
