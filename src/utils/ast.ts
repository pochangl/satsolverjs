import { Parser } from './parser'

export interface IAbstractSyntaxTree {
  name: string
  value?: string
  clauses: IAbstractSyntaxTree[]
}
const parser = Parser()

function fill_clauses(tree: IAbstractSyntaxTree) {
  tree.clauses = tree.clauses || []
  tree.clauses.map(fill_clauses)
  return tree
}

export function ast(str: string): IAbstractSyntaxTree {
  /*
    convert string to ast tree
  */
  return fill_clauses(parser.parse(str.trim()))
}
