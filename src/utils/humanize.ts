import { IAbstractSyntaxTree } from './ast'

export function stringify(tree: IAbstractSyntaxTree): string {
  if (tree.type === 'atomic') {
    return tree.value as string
  } else if (tree.type === 'prefix') {
    return '(' + tree.name + ' ' + tree.clauses.map(stringify).join(' ') + ')'
  } else {
    return '(' + tree.clauses.map(stringify).join(' ' + tree.name + ' ') + ')'
  }
}
