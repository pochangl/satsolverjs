import { IAbstractSyntaxTree } from './ast'

export function stringify(tree: IAbstractSyntaxTree): string {
  if (tree.name === 'atomic')
    return tree.value as string
  else if (tree.name === 'not')
    return '(not ' + stringify(tree.clauses[0]) + ')'
  return '(' + tree.clauses.map(stringify).join(' ' + tree.name + ' ') + ')'
}
