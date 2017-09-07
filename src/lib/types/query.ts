import {isFunction} from "util";
import {argumentNamesOfFunction} from "../utils/index";
import {checkParameters, parameterMetaKey} from "./parameters";
import {checkReturnType, returnTypeArrayOfMetaKey} from "./returnType";

const registeredQueriesByClass = {};
const registeredMutationsByClass = {};

let getMethodDefinition = function (proto, methodName: string, properDesc: PropertyDescriptor) {

  if (!isFunction(properDesc.value)) {
    throw Error('Property must be a function')
  }

  const returnType = Reflect.getMetadata('design:returntype', proto, methodName)
  const parameterTypes = Reflect.getMetadata('design:paramtypes', proto, methodName)

  checkParameters(proto, methodName, parameterTypes);
  checkReturnType(proto, methodName, returnType)

  const parameterNames = argumentNamesOfFunction(proto[methodName])

  const ps = parameterTypes.map((pt, index) => {
    let arrayOf;
    if (pt.name === 'Array') {
      arrayOf = proto[parameterMetaKey(methodName, index)]
    }
    return {
      type: pt.name, arrayOf, identifier: parameterNames[index]
    }
  })

  let methodDef = {
    methodName,
    parameters: ps,
    returnType: {name: returnType.name, arrayOf: proto[returnTypeArrayOfMetaKey(methodName)]}
  };
  return methodDef
};


export function registerQuery(queryName?: string): MethodDecorator {
  return function (proto, methodName: string, properDesc: PropertyDescriptor) {

    const def = getMethodDefinition(proto, methodName, properDesc)

    const className = proto.constructor.name

    let queryDef = {...def, queryName: queryName || methodName};

    if (registeredQueriesByClass[className]) {
      registeredQueriesByClass[className].push(queryDef)
    } else {
      registeredQueriesByClass[className] = [queryDef]
    }
  }
}


export function registerMutation(mutationName?: string) {
  return function (proto, methodName: string, properDesc: PropertyDescriptor) {
    const methodDef = getMethodDefinition(proto, methodName, properDesc);
    const queryDef = {...methodDef, mutationName: mutationName || methodName,};
    const className = proto.constructor.name;
    
    if (registeredMutationsByClass[className]) {
      registeredMutationsByClass[className].push(queryDef)
    } else {
      registeredMutationsByClass[className] = [queryDef]
    }
  }
}


export const allQueriesGroupByClass = (): any => registeredQueriesByClass
export const allMutationsGroupByClass = (): any => registeredMutationsByClass
