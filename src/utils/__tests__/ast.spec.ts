import { ast } from '../ast'
import { precedence } from '../alias'

describe('ast basic', () => {
  it('should handles 2 oeprands', () => {
    expect(ast('a implies b')).toMatchObject({
      operands: [
        {
          name: 'atomic',
          value: 'a'
        }, {
          name: 'atomic',
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
          name: 'atomic',
          value: 'a'
        }
      ]
    })

    // rear
    expect(ast('implies a')).toMatchObject({
      operands: [
        {
          name: 'atomic',
          value: 'a'
        }
      ]
    })
  })

  it('should handles atomic', () => {
    expect(ast(' a b c ')).toEqual({
      name: 'atomic',
      value: 'a b c',
      operands: []
    })
  })
})

describe('ast nested', () => {
  test('a and b implies b implies c', () => {
    expect(ast('a and b implies c implies d')).toEqual({
      name: 'implies',
      operands: [
        {
          name: 'and',
          operands: [
            {
              name: 'atomic',
              value: 'a',
              operands: []
            }, {
              name: 'atomic',
              value: 'b',
              operands: []
            }
          ]
        },
        {
          name: 'implies',
          operands: [
            {
              name: 'atomic',
              value: 'c',
              operands: []
            }, {
              name: 'atomic',
              value: 'd',
              operands: []
            }
          ]
        }
      ]
    })
  })
})
