import * as chai from 'chai'
import {argumentNamesOfFunction} from "../src/lib/utils/index";

const {expect} = chai

describe('arguments name', () => {


  it('normal func', () => {
    function func1(a, b, c) {
    }

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('normal func with default value', () => {
    function func1(a = 0, b = true, c = {d: 1}) {
    }

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('=> function', () => {
    const func1 = (a, b, c) => ({})

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })


  it('array with default value function', () => {

    const func1 = (a = 1, b = true, c = {d: 1}) => ({})

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })

  it('arrow function with  deconstruct', () => {

    const func1 = ({a}) => ({})

    expect(argumentNamesOfFunction(func1)).to.deep.equal(['a', 'b', 'c'])
  })


})
