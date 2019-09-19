import * as LogicSolver from 'logic-solver'
import { And, Not, Variable } from './logic'

function toArray(logic: And): string[][] {
  return logic.clauses.map(clause => {
    return clause.clauses.map(atomic => {
      if (atomic instanceof Not) {
        return '-' + atomic.clauses[0].value
      } else {
        return atomic.value as string
      }
    })
  })
}

function toFact(fact: string[]): And {
  let and = new And([])

  and.clauses = fact.map(name => {
    if (name[0] == '-') {
      return new Not([
        new Variable([], name.slice(1))
      ])
    } else {
      return new Variable([], name)
    }
  })
  return and
}

export function* solve(logic: And): IterableIterator<And> {
  logic.validateCNF()
  const cnf = toArray(logic)
  const solver = new LogicSolver.Solver()

  for (let names of cnf) {
    solver.require(LogicSolver.or(names))
  }
  let solution: LogicSolver.Solution
  while (solution = solver.solve()) {
    yield toFact(solution.getTrueVars())
    solver.forbid(solution.getFormula())
  }
}
