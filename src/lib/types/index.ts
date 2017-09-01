import 'reflect-metadata'


export interface ITypeDef {
  name: string,
  arrayOf?: string
}


export * from './fields'
export * from './parameters'
export * from './returnType'
export * from './query'



