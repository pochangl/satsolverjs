import { ast } from '../ast'
import { precedence } from '../alias'

describe('ast', () => {
  it('should have symbol', () => {
    expect(ast('a not b')).toMatchObject({
      symbol: '¬',
      name: 'not',
    })
  })

  it('should handles 2 oeprands', () => {
    expect(ast('a implies b')).toMatchObject({
      operands: [
        {
          symbol: 'atomic',
          value: 'a'
        }, {
          symbol: 'atomic',
          value: 'b'
        }
      ]
    })
  })
  it('should handles 1 operands', () => {
    // front
    expect(ast('a implies')).toMatchObject({
      operands: [
        {
          symbol: 'atomic',
          value: 'a'
        }
      ]
    })

    // rear
    expect(ast('implies a')).toMatchObject({
      operands: [
        {
          symbol: 'atomic',
          value: 'a'
        }
      ]
    })
  })

  it('should handles atomic', () => {
    expect(ast(' a b c ')).toEqual({
      symbol: 'atomic',
      name: 'atomic',
      value: 'a b c'
    })
  })
})
