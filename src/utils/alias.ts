interface ISplit {
  symbol: string
  name: string
  operands: Array<string>
}
interface IAlias {
  symbol: string
  name: string

  split(str: string): ISplit | undefined
}

function alias(symbol: string, name: string): IAlias {
  const regex = new RegExp(' ' + name + ' ', 'i')
  return {
    symbol,
    name,
    split(str) {
      const s = ' ' + str.trim() + ' '
      const match = s.match(regex)
      if (match && typeof match.index !== 'undefined') {
        const index: number = match.index
        const left = s.slice(0, index).trim()
        const right = s.slice(index + name.length + 2).trim()
        return {
          symbol,
          name,
          operands: [left, right].filter(x => x)
        }
      }
    }
  }
}

export const precedence: Array<IAlias> = [
  alias('→', 'implies'),
  alias('∨', 'or'),
  alias('∧', 'and'),
  alias('¬', 'not'),
]
