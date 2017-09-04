import {isFunction} from "util";
import {argumentNamesOfFunction} from "../utils/index";
import {checkParameters, parameterMetaKey} from "./parameters";
import {checkReturnType, returnTypeArrayOfMetaKey} from "./returnType";

const registeredQueriesByClass = {};

export function registerQuery(queryName?: string): MethodDecorator {
  return function (proto, methodName: string, properDesc: PropertyDescriptor) {
    if (!isFunction(properDesc.value)) {
      throw Error('Query must be a function')
    }

    const className = proto.constructor.name

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

    let queryDef = {
      methodName,
      queryName: queryName || methodName,
      parameters: ps,
      returnType: {name: returnType.name, arrayOf: proto[returnTypeArrayOfMetaKey(methodName)]}
    };

    if (registeredQueriesByClass[className]) {

      registeredQueriesByClass[className].push(queryDef
      )
    } else {
      registeredQueriesByClass[className] = [queryDef]
    }
  }
}

export const allQueriesGroupByClass = (): any => registeredQueriesByClass
