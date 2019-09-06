import { precedence } from './alias'

export interface IAbstractSyntaxTree {
  name: string
  value?: string
  operands: Array<IAbstractSyntaxTree>
}

export function ast(str: string): IAbstractSyntaxTree {
  for (const splitter of precedence) {
    const split = splitter.split(str)
    if (split) {
      // matched
      return {
        name: split.name,
        operands: split.operands.map(ast)
      }
    }
  }
  // no match
  return {
    name: 'atomic',
    operands: [],
    value: str.trim()
  }
}
