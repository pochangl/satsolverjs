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
  test('precedence', () => {
    expect(ast('a and b implies c or d and not e implies f')).toEqual({
      name: 'implies',
      operands: [
        {
          name: 'and', operands: [
            { name: 'atomic', value: 'a', operands: [] },
            { name: 'atomic', value: 'b', operands: [] }
          ]
        },
        {
          name: 'implies', operands: [
            {
              name: 'or', operands: [
                { name: 'atomic', value: 'c', operands: [] },
                {
                  name: 'and', operands: [
                    { name: 'atomic', value: 'd', operands: [] },
                    {
                      name: 'not', operands: [
                        { name: 'atomic', value: 'e', operands: [] }
                      ]
                    }
                  ]
                }
              ]
            },
            { name: 'atomic', value: 'f', operands: [] }
          ]
        }
      ]
    })
  })
})
