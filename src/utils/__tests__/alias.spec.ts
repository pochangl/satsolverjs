import { precedence } from '../alias'

const aliases = Object.assign({}, ...precedence.map(alias => ({
  [alias.name]: alias
})))

describe('Alias.split', () => {
  test('and oeprator', () => {
    const alias = aliases['and']
    expect(alias.split('a and b')).toMatchObject({
      symbol: '∧',
      name: 'and',
      operands: ['a', 'b']
    })
  })

  test('or oeprator', () => {
    const alias = aliases['or']
    expect(alias.split('a or b')).toMatchObject({
      symbol: '∨',
      name: 'or',
      operands: ['a', 'b']
    })
  })

  test('not oeprator', () => {
    const alias = aliases['not']
    expect(alias.split('a not b')).toMatchObject({
      symbol: '¬',
      name: 'not',
      operands: ['a', 'b']
    })
  })

  test('implies oeprator', () => {
    const alias = aliases['implies']
    expect(alias.split('a implies b')).toMatchObject({
      symbol: '→',
      name: 'implies',
      operands: ['a', 'b']
    })
  })

  test('space triming', () => {
    const alias = aliases['and']
    expect(alias.split('  a   and   b  ')).toMatchObject({
      operands: ['a', 'b']
    })
  })

  test('space padding', () => {
    const alias = aliases['and']
    expect(alias.split('and')).toMatchObject({
      operands: []
    })
  })

  test('no match', () => {
    const alias = aliases['and']
    expect(alias.split('c d e')).toBeUndefined()
  })

  test('empty', () => {
    const alias = aliases['and']
    expect(alias.split('')).toBeUndefined()
  })

  test('concatenated string', () => {
    const alias = aliases['and']
    for (const str of ['land', 'andl', 'landl'])
      expect(alias.split('a ' + str + ' a')).toBeUndefined()
  })
})
