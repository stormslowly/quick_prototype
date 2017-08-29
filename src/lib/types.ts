import 'reflect-metadata'
import {isFunction} from "util";

const registeredTypes = {
  Number: {type: 'Number'},
  String: {type: 'String'},
  Boolean: {type: 'Number'},
}

const registeredQueries = {};


interface IFiledDesc {
  name?: string;
  required?: boolean;
  type?: String
  arrayOf?: String
}

const typeNames = []

const getTypeWithName = (typeName: string) => {
  if (registeredTypes[typeName]) {
    return registeredTypes[typeName]
  }

  typeNames.push(typeName)

  return registeredTypes[typeName] = {}

}

const registerToType = (typeName: string, desc: IFiledDesc) => {
  getTypeWithName(typeName)[desc.name] = desc
}


export const registerField = function (fieldDesc: IFiledDesc = {}) {

  return function (target: Object, key: string) {
    const typeName = target.constructor.name || fieldDesc.name

    const type = Reflect.getMetadata('design:type', target, key)

    if (type.name === 'Array' && !fieldDesc.arrayOf) {
      throw Error('Array Type must specify parameterArrayOf property')
    }

    registerToType(typeName, {
      ...fieldDesc,
      name: key, type: type.name
    })
  }
}

function checkParameters(proto, methodName: string, parameters: { name: string }[]) {

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

function parameterMetaKey(methodName: string, parameterIndex: number) {
  return `${methodName}_${parameterIndex}`
}

function returnTypeMetaKey(methodName: string) {
  return `${methodName}_returntype}`
}


function checkReturnType(returnType: { name: string }) {
  const allTypes = allRegisteredTypes()

  if (!allTypes[returnType.name]) {
    console.error('return type validate failed', returnType.name)
    throw Error('return validate failed')
  }
}

export function parameterArrayOf(type: string) {
  return function (prototype, method_name: String, index) {
    const metaKey = `${method_name}_${index}`;
    prototype[metaKey] = type
  }
}

export function registerQuery(queryName?: string): MethodDecorator {
  return function (proto, methodName: string, properDesc: PropertyDescriptor) {
    if (!isFunction(properDesc.value)) {
      throw Error('Query must be a function')
    }

    const className = proto.constructor.name

    const returnType = Reflect.getMetadata('design:returntype', proto, methodName)
    const parameterTypes = Reflect.getMetadata('design:paramtypes', proto, methodName)

    checkParameters(proto, methodName, parameterTypes);
    checkReturnType(returnType)

    const ps = parameterTypes.map((pt, index) => {
      let arrayOf;
      if (pt.name === 'Array') {
        arrayOf = proto[parameterMetaKey(methodName, index)]
      }
      return {
        type: pt.name, arrayOf
      }
    })

    registeredQueries[className] = {
      methodName,
      queryName: queryName || methodName,
      parameters: ps,
      returnType: {name: returnType.name}
    }
  }
}

export function allRegisteredTypesName() {
  return typeNames
}


export const allRegisteredTypes = (): any => {


  return registeredTypes

  // return typeNames.map((name) => {
  //   return registeredTypes[name];
  // })
}


export const allQueries = (): any => registeredQueries
