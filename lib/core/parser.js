import * as babelParser from '@babel/parser'

export const parse = (content) =>
  babelParser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx']
  })