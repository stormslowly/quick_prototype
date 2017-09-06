import {allRegisteredTypes} from "./fields";

export function returnTypeArrayOfMetaKey(methodName: string) {
  return `${methodName}_returnType_arrayOf}`
}

export function checkReturnType(proto, methodName, returnType: { name: string, arrayOf?: string }) {
  const allTypes = allRegisteredTypes()

  let name = returnType.name;

  if (returnType.name === 'Array') {
    const metaKey = returnTypeArrayOfMetaKey(methodName)
    let arrayOf = proto[metaKey]
    name = arrayOf
  }

  if (!allTypes[name]) {
    console.error('return type validate failed of method', methodName, returnType.name)
    throw Error('returnType validate failed')
  }
}

export function returnTypeArrayOf(type: string) {
  return function (prototype, method_name: string) {
    const metaKey = returnTypeArrayOfMetaKey(method_name);
    prototype[metaKey] = type
  }
}
