import Vue from 'vue'
import pegjs from 'pegjs'
import parser from './parser'

export function Parser(text?: string): pegjs.Parser {
  if (text) {
    return pegjs.generate(text)
  } else {
    return parser
  }
}
const http = (new Vue() as any).$http

export async function fromUrl(url: string): Promise<pegjs.Parser> {
  const response = await http.get(url)
  const text = await response.text()
  return pegjs.generate(text)
}
