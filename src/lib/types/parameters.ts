import {allRegisteredTypes} from "./fields";


export function checkParameters(proto, methodName: string, parameters: { name: string }[]) {

  const allTypes = allRegisteredTypes()

  const valid = parameters.every((p, index) => {
    if (p.name === 'Array') {

      const arrayOf = `${methodName}_${index}`
      if (allTypes[proto[arrayOf]]) {
        return true
      } else {
        console.error('checkParameters : ', p.name, 'has No parameterArrayOf description');
        return false
      }
    }

    if (allTypes[p.name]) {
      return true
    }
  });

  if (!valid) {
    throw Error('parameter validate failed')
  }
}

export function parameterMetaKey(methodName: string, parameterIndex: number) {
  return `${methodName}_${parameterIndex}`
}

export function parameterArrayOf(type: string) {
  return function (prototype, method_name: String, index) {
    const metaKey = `${method_name}_${index}`;
    prototype[metaKey] = type
  }
}
