import { precedence } from './alias'

export interface IAbstractSyntaxTree {
  symbol: string
  name: string
  value?: string
  operands?: Array<IAbstractSyntaxTree>
}

export function ast(str: string): IAbstractSyntaxTree {
  for (const splitter of precedence) {
    const split = splitter.split(str)
    if (split) {
      // matched
      return {
        symbol: split.symbol,
        name: split.name,
        operands: split.operands.map(ast)
      }
    }
  }
  // no match
  return {
    symbol: 'atomic',
    name: 'atomic',
    value: str.trim()
  }
}
