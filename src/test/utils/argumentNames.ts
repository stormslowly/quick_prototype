import * as chai from 'chai'
import {argumentNamesOfFunction} from "../../lib/utils/index";

const {expect} = chai

describe('class method arguments name', () => {

  it('normal method', () => {

    class test1 {
      func1(a, b, c) {
      }
    }

    expect(argumentNamesOfFunction(test1.prototype.func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('normal method with default value', () => {
    class test2 {
      func1(a = 0, b = true, c = {d: 1}) {
      }
    }

    expect(argumentNamesOfFunction(test2.prototype.func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it.skip('=> function', () => {

    class test3 {
      func1 = (a, b, c) => ({})
    }

    expect(argumentNamesOfFunction(test3.prototype.func1)).to.deep.equal(['a', 'b', 'c'])
  })


  it.skip('array with default value function', () => {

    const func1 = (a = 1, b = true, c = {d: 1}) => ({})

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('arrow function with deconstruct', () => {

    class methodWithDeconstruct {
      func1({a}) {
      }
    }


    expect(() => argumentNamesOfFunction(methodWithDeconstruct.prototype.func1)).to.throw('Deconstruct Not Supported in Query')
  })


})
