const esprima = require('esprima');
const _ = require('lodash');

// ref https://stackoverflow.com/a/32108558

export function argumentNamesOfFunction(func: Function): string[] {
  const maybe = (x) => (x || {});

  const functionAsString = func.toString();
  const tree = esprima.parse(functionAsString);

  const isArrowExpression = (maybe(_.first(tree.body)).type == 'ExpressionStatement');
  const params = isArrowExpression ?
    maybe(maybe(_.first(tree.body)).expression).params
    : maybe(_.first(tree.body)).params;

  if (params.some(para => para.type === 'ObjectPattern')) {
    throw Error('Deconstruct Not Supported in Query')
  }

  return params.map(p => {
    return p.name || p.left && p.left.name
  })
};
