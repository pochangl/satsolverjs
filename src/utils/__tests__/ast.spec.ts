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
  test('implies/or', () => {
    expect(ast('a or b implies c or d')).toMatchObject({
      name: 'implies',
      operands: [{
        name: 'or', operands: [
          { name: 'atomic', value: 'a' },
          { name: 'atomic', value: 'b' },
        ]
      }, {
        name: 'or', operands: [
          { name: 'atomic', value: 'c' },
          { name: 'atomic', value: 'd' },
        ]
      }]
    })
  })

  test('or/and', () => {
    expect(ast('a and b or c and d')).toMatchObject({
      name: 'or',
      operands: [{
        name: 'and', operands: [
          { name: 'atomic', value: 'a' },
          { name: 'atomic', value: 'b' },
        ]
      }, {
        name: 'and', operands: [
          { name: 'atomic', value: 'c' },
          { name: 'atomic', value: 'd' },
        ]
      }]
    })
  })

  test('and/not', () => {
    expect(ast('not a and not b')).toMatchObject({
      name: 'and',
      operands: [{
        name: 'not', operands: [
          { name: 'atomic', value: 'a' }
        ]
      }, {
        name: 'not', operands: [
          { name: 'atomic', value: 'b' }
        ]
      }]
    })
  })


  test('complex', () => {
    expect(ast('a and b implies c or d and not e implies f')).toMatchObject({
      name: 'implies',
      operands: [{
        name: 'and', operands: [
          { name: 'atomic', value: 'a' },
          { name: 'atomic', value: 'b' }
        ]
      }, {
        name: 'implies', operands: [{
          name: 'or', operands: [{
            name: 'atomic', value: 'c'
          }, {
            name: 'and', operands: [{
              name: 'atomic', value: 'd'
            },
            {
              name: 'not', operands: [{
                name: 'atomic', value: 'e'
              }]
            }]
          }]
        },
        { name: 'atomic', value: 'f' }]
      }]
    })
  })
})
