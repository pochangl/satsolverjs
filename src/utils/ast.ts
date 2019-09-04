import { precedence } from './alias'

interface IAbstractSyntaxTree {
  symbol: string
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
        operands: split.operands.map(ast)
      }
    }
  }
  // no match
  return {
    symbol: 'atomic',
    value: str.trim()
  }
}
