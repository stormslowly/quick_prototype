import * as chai from 'chai'
import {argumentNamesOfFunction} from "../../lib/utils/index";

const {expect} = chai

describe('class method arguments name', () => {

  it('normal method', () => {
    class Test1 {
      func1(a, b, c) {
      }
    }

    expect(argumentNamesOfFunction(Test1.prototype.func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('normal method with default value', () => {
    class Test2 {
      func1(a = 0, b = true, c = {d: 1}) {
      }
    }

    expect(argumentNamesOfFunction(Test2.prototype.func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it.skip('=> function', () => {

    class Test3 {
      func1 = (a, b, c) => ({})
    }

    expect(argumentNamesOfFunction(Test3.prototype.func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it.skip('array with default value function', () => {

    const func1 = (a = 1, b = true, c = {d: 1}) => ({})

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('arrow function with deConstruct', () => {
    class MethodWithDeconstruct {
      func1({a}) {
      }
    }

    expect(() => argumentNamesOfFunction(MethodWithDeconstruct.prototype.func1)).to.throw('Deconstruct Not Supported in Query')
  })

  it('function with type', () => {
    class MethodWithType {
      func1(a: string) {
      }
    }

    expect(argumentNamesOfFunction(MethodWithType.prototype.func1)).to.deep.equal(['a'])
  })
})
