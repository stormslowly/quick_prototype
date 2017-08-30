const esprima = require('esprima');
var _ = require('lodash');

// rehttps://stackoverflow.com/a/32108558

export function argumentNamesOfFunction(func: Function): string[] {
  // allows us to access properties that may or may not exist without throwing
  // TypeError: Cannot set property 'x' of undefined
  const maybe = (x) => (x || {});

  // handle conversion to string and then to JSON AST
  const functionAsString = func.toString();
  const tree = esprima.parse(functionAsString);
  console.log(JSON.stringify(tree, null, 4))
  // We need to figure out where the main params are. Stupid arrow functions 👊

  const isArrowExpression = (maybe(_.first(tree.body)).type == 'ExpressionStatement');
  const params = isArrowExpression ?
    maybe(maybe(_.first(tree.body)).expression).params
    : maybe(_.first(tree.body)).params;

  // extract out the param names from the JSON AST
  return params.map(p => {
    return p.name || p.left && p.left.name
  })
};
