import { ast } from '../ast'
import { precedence } from '../alias'

describe('ast basic', () => {
  it('should handles 2 clauses', () => {
    expect(ast('a implies b')).toMatchObject({
      clauses: [
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
  it('should handles 1 clauses', () => {
    // prefix
    expect(ast('not a')).toMatchObject({
      clauses: [
        {
          name: 'atomic',
          value: 'a'
        }
      ]
    })
  })

  it('should handles atomic', () => {
    expect(ast('b ')).toEqual({
      name: 'atomic',
      value: 'b',
      clauses: []
    })
  })
})

describe('ast nested', () => {
  test('implies/or', () => {
    expect(ast('a or b implies c or d')).toMatchObject({
      name: 'implies',
      clauses: [{
        name: 'or', clauses: [
          { name: 'atomic', value: 'a' },
          { name: 'atomic', value: 'b' },
        ]
      }, {
        name: 'or', clauses: [
          { name: 'atomic', value: 'c' },
          { name: 'atomic', value: 'd' },
        ]
      }]
    })
  })

  test('or/and', () => {
    expect(ast('a and b or c and d')).toMatchObject({
      name: 'or',
      clauses: [{
        name: 'and', clauses: [
          { name: 'atomic', value: 'a' },
          { name: 'atomic', value: 'b' },
        ]
      }, {
        name: 'and', clauses: [
          { name: 'atomic', value: 'c' },
          { name: 'atomic', value: 'd' },
        ]
      }]
    })
  })

  test('and/not', () => {
    expect(ast('not a and not b')).toMatchObject({
      name: 'and',
      clauses: [{
        name: 'not', clauses: [
          { name: 'atomic', value: 'a' }
        ]
      }, {
        name: 'not', clauses: [
          { name: 'atomic', value: 'b' }
        ]
      }]
    })
  })


  test('complex', () => {
    expect(ast('a and b implies c or d and not e implies f')).toMatchObject({
      name: 'implies',
      clauses: [{
        name: 'and', clauses: [
          { name: 'atomic', value: 'a' },
          { name: 'atomic', value: 'b' }
        ]
      }, {
        name: 'implies', clauses: [{
          name: 'or', clauses: [{
            name: 'atomic', value: 'c'
          }, {
            name: 'and', clauses: [{
              name: 'atomic', value: 'd'
            },
            {
              name: 'not', clauses: [{
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
