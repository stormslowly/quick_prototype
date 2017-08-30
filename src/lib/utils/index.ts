const esprima = require('esprima');
const _ = require('lodash');

// ref https://stackoverflow.com/a/32108558

export function argumentNamesOfFunction(func: Function): string[] {
  const functionAsString = `
  class test {
  ${func.toString()}
  }
  `
  const programTree = esprima.parse(functionAsString);
  const classDeclaration = programTree.body[0]
  const classBody = classDeclaration.body
  const params = classBody.body[0].value.params

  if (params.some(para => para.type === 'ObjectPattern')) {
    throw Error('Deconstruct Not Supported in Query')
  }

  return params.map(p => p.name || p.left && p.left.name)
}
