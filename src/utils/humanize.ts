import { IAbstractSyntaxTree } from './ast'

export function stringify(tree: IAbstractSyntaxTree): string {
  if (tree.name === 'variable') {
    return tree.value as string
  } else if (tree.name === 'not') {
    return '(not ' + stringify(tree.clauses[0]) + ')'
  } else {
    return '(' + tree.clauses.map(stringify).join(' ' + tree.name + ' ') + ')'
  }
}
