declare module 'logic-solver' {
  class Fact { }
  class Formula { }
  class Solution {
    getTrueVars(): string[]
    getFormula(): Formula
    getMap(): any
  }
  class Solver {
    require(fact: Fact): void
    solve(): Solution
    forbid(formula: Formula): void
  }
  function or(operands: string[]): Fact
}
