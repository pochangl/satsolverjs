import { precedence } from './alias'
import { Parser } from './parser'

export interface IAbstractSyntaxTree {
  name: string
  value?: string
  clauses?: Array<IAbstractSyntaxTree>
}
const parser = Parser()
export function ast(str: string): IAbstractSyntaxTree {
  /*
    convert string to ast tree
  */
  return parser.parse(str)
}
