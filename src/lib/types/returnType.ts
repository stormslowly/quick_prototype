import {allRegisteredTypes} from "./fields";

export function returnTypeArrayOfMetaKey(methodName: string) {
  return `${methodName}_returnType_arrayOf}`
}

export function returnTypePromiseOfMetaKey(methodName: string) {
  return `${methodName}_returnType_promiseOf}`
}

export function checkReturnType(proto, methodName, returnType: { name: string, arrayOf?: string }) {
  const allTypes = allRegisteredTypes()

  let name = returnType.name;

  if (returnType.name === 'Array') {
    const metaKey = returnTypeArrayOfMetaKey(methodName)
    let arrayOf = proto[metaKey]
    name = arrayOf
  }

  if (returnType.name === 'Promise') {
    const metaKey = returnTypePromiseOfMetaKey(methodName)
    let promiseOf = proto[metaKey]
    name = promiseOf
  }

  console.log(`${__filename}:28 checkReturnType`, name);


  if (!allTypes[name]) {
    console.error('return type validate failed of method', methodName, returnType.name)
    throw Error('returnType validate failed')
  }
}

export function returnTypeArrayOf(type: string) {
  return function (prototype, methodName: string) {
    const metaKey = returnTypeArrayOfMetaKey(methodName);
    prototype[metaKey] = type
  }
}

export function returnTypePromiseOf(type: string) {
  return function (prototype, methodName: string) {
    const metaKey = returnTypePromiseOfMetaKey(methodName);
    prototype[metaKey] = type
  }
}
