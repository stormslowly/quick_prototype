export interface NormalTypeDef {
  name: string
  arrayOf?: string
  promiseOf?: string
  promiseArrayOf: string
}

export type ITypeDef = NormalTypeDef

export * from './types/fields'
export * from './types/parameters'
export * from './types/returnType'
export * from './types/query'
export * from './typesToGraphqlSchema'
