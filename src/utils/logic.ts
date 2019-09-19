import { IAbstractSyntaxTree } from './ast'
import { stringify } from './humanize'

declare type ILogicTransformer = (ast: IAbstractSyntaxTree, clauses: Logic[]) => Logic

interface ILogics {
  [key: string]: ILogicTransformer
}

function expand(logic: Logic, type: new (c: Logic[]) => Logic): Logic[] {
  if (logic instanceof type) {
    return ([] as Logic[]).concat(...logic.clauses.map(clause => expand(clause, type)))
  } else {
    return [logic]
  }
}

export class CNFError extends Error {
  public name: 'CNF error'
  constructor(tree: Logic) {
    super('Unable to reduce ' + tree.toString() + ' to conjunction normal form')
  }
}

export abstract class Logic implements IAbstractSyntaxTree {
  /*
    logic class for handling logic operation
  */

  // merging similar logic
  public abstract merge(): Logic

  // for checking validity
  public abstract isCNF(): boolean
  // for debugging purpose
  public abstract name: string

  // negation
  public abstract negate(): Logic

  public clauses: Logic[]
  public value?: string

  constructor(clauses: Logic[], value?: string) {
    this.clauses = clauses
    this.value = value
  }

  public validateCNF(): void {
    // raise error if invalid
    if (!this.isCNF()) {
      throw new CNFError(this)
    }

    for (const clause of this.clauses) {
      clause.validateCNF()
    }
  }

  public runMerge(): Logic {
    // merge logic
    this.clauses = this.clauses.map(clause => clause.merge())
    return this.merge()
  }

  public simplify(): Logic {
    /* propagate Not operator to the tree leave */
    this.clauses = this.clauses.map(clause => clause.simplify())
    return this
  }
  public toString(): string {
    return stringify(this)
  }
}

export class Variable extends Logic {
  public name = 'variable'

  public isCNF() {
    return true
  }
  public merge() {
    /*
      atomic is the most basic element
      nothing to merge
    */
    return this
  }

  public negate(): Logic {
    return new Not([this])
  }
}

export class Not extends Logic {
  public name = 'not'

  public isCNF() {
    return this.clauses.every(value => value instanceof Variable)
  }
  public merge(): Logic {
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
  public negate() {
    return this.clauses[0]
  }

  public simplify(): Logic {
    const clause = this.clauses[0]
    if (clause instanceof Variable) {
      return this
    }
    return clause.negate().simplify()
  }
}

export class Or extends Logic {
  public name = 'or'

  public isCNF() {
    return this.clauses.every(value => value instanceof Variable || value instanceof Not)
  }
  public merge(): Logic {
    /*
      merge or logic
      for example:
        a or (b or c) => (a or b or c)
    */
    this.clauses = expand(this, Or)
    // this.clauses = this.clauses.filter(clause => !(clause instanceof Or))
    return this
  }
  public negate(): Logic {
    const logic = new And([])
    logic.clauses = this.clauses.map(clause => clause.negate())
    return logic
  }
}

export class And extends Logic {
  public name = 'and'

  public isCNF() {
    return this.clauses.every(value => value instanceof Variable || value instanceof Not || value instanceof Or)
  }
  public merge(): Logic {
    /*
      merge and logic
      for example:
        a and (b and c) => (a and b and c)
    */
    this.clauses = expand(this, And)
    // this.clauses = this.clauses.filter(clause => !(clause instanceof And))
    return this
  }
  public negate(): Logic {
    const logic = new Or([])
    logic.clauses = this.clauses.map(clause => clause.negate())
    return logic
  }
}

const logics: ILogics = {
  variable(ast) {
    return new Variable([], ast.value)
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

export function toCNF(ast: IAbstractSyntaxTree): Logic {
  /*
    conver abstract syntax tree to cnf logic
  */
  const tree = logicfy(ast).runMerge().simplify().runMerge()
  tree.validateCNF()
  return tree
}
