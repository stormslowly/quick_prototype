import * as debug from 'debug'
import {allRegisteredTypes} from "./fields";

const debugLog = debug(`okiedokie:${__filename}`)

export function returnTypeArrayOfMetaKey(methodName: string) {
  return `${methodName}_returnType_arrayOf}`
}

export function returnTypePromiseOfMetaKey(methodName: string) {
  return `${methodName}_returnType_promiseOf}`
}

export function returnTypePromiseOfArrayMetaKey(methodName: string) {
  return `${methodName}_returnType_promiseOfArray}`
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
    if (promiseOf) {
      name = promiseOf
    } else {
      const promiseArrayOf = proto[returnTypePromiseOfArrayMetaKey(methodName)]
      if (promiseArrayOf)
        name = promiseArrayOf
    }
  }

  debugLog(`${__filename}:28 checkReturnType`, name);

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

export function returnTypePromiseOfArray(type: string) {
  return function (prototype, methodName: string) {
    const metaKey = returnTypePromiseOfArrayMetaKey(methodName);
    prototype[metaKey] = type
  }
}
