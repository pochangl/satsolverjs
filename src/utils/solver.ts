import * as LogicSolver from 'logic-solver'
import { And, Not, Or, Variable, Logic } from './logic'

function toOrArray(logic: Or): string[] {
  return logic.clauses.map(atomic => {
    if (atomic instanceof Not) {
      return '-' + atomic.clauses[0].value
    } else {
      return atomic.value as string
    }
  })
}

function toAndArray(logic: Logic): string[][] {
  if (logic instanceof Variable) {
    return [[logic.value as string]]
  } else if (logic instanceof Or) {
    return [toOrArray(logic)]
  }

  return logic.clauses.map(clause => {
    if (!(clause instanceof Or)) {
      clause = new Or([clause])
    }
    return toOrArray(clause)
  })
}

export function toFact(fact: string[]): And {
  const and = new And([])

  and.clauses = fact.map(name => {
    if (name[0] === '-') {
      return new Not([
        new Variable([], name.slice(1))
      ])
    } else {
      return new Variable([], name)
    }
  })
  return and
}

export function* solve(logic: Logic): IterableIterator<LogicSolver.Solution> {
  logic.validateCNF()
  const cnf = toAndArray(logic)
  const solver = new LogicSolver.Solver()

  for (const names of cnf) {
    solver.require(LogicSolver.or(names))
  }
  let solution: LogicSolver.Solution = solver.solve()
  while (solution) {
    yield solution
    solver.forbid(solution.getFormula())
    solution = solver.solve()
  }
}
