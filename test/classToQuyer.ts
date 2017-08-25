import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {isFunction} from "util";
import {registerField, allRegisteredTypes} from "../src/lib/types";


const queries = {};

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

function returnTypeMetaKey(methodName: string, parameterIndex: number) {
  return `${methodName}_${parameterIndex}`
}


function queryRegister(queryName?: string): MethodDecorator {
  return function (proto, methodName: string, properDesc: PropertyDescriptor) {
    if (!isFunction(properDesc.value)) {
      throw Error('Query must be a function')
    }

    const returnType = Reflect.getMetadata('design:returntype', proto, methodName)
    const parameterTypes = Reflect.getMetadata('design:paramtypes', proto, methodName)

    checkParameters(proto, methodName, parameterTypes);

    parameterTypes.map((pt, index) => {
      let arrayOf;
      if (pt.name === 'Array') {
        arrayOf = proto[parameterMetaKey(methodName, index)]
      }
      return {
        type: pt.name, arrayOf
      }
    })


    console.log(`${__filename}:14 type`, returnType.name);
    console.log(`${__filename}:16 `, parameterTypes.map(type => type.name));
    console.log(`${__filename}:17 `, parameterTypes[0]);
  }
}


function parameterArrayOf(type: string) {
  return function (prototype, method_name: String, index) {
    const metaKey = `${method_name}_${index}`;
    prototype[metaKey] = type
  }
}

describe('class method defination', () => {

  it('get method defination', () => {

    class TestCarQuery {
      @registerField({})
      id: string;

      @queryRegister('test')
      getCard(name: string, other: TestCarQuery, @parameterArrayOf('Number') numbers: number[]): TestCarQuery {
        this.id = name + other.id
        return this
      }
    }

    const query = new TestCarQuery()

    console.log(query.constructor.name)


  })


})
