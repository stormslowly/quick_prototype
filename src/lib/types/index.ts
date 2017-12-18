interface NormalTypeDef {
  name: string
  arrayOf?: string
  promiseOf?: string
}


export type ITypeDef = NormalTypeDef

export * from './fields'
export * from './parameters'
export * from './returnType'
export * from './query'
