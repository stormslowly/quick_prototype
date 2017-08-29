import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat
} from 'graphql';


const Car = new GraphQLObjectType({
  name: 'Car',
  fields: {
    engineName: {type: GraphQLString},
    owners: {type: new GraphQLList(GraphQLString)}
  }
})


const types = [
  Car
]

const schema = new GraphQLSchema({

  types,

  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: types[0],
        resolve() {
          return 'world';
        }
      }
    }
  })
});


const type = schema.getType('RootQueryType') as GraphQLObjectType

console.log(type.getFields())


const stringToGraphqlSchema = {
  Number: GraphQLFloat,
  String: GraphQLString,
}


function mapTOSchema(fieldsDefinition) {
  const schema = {}
  for (let [key, value] of fieldsDefinition) {
    schema[key] = toSchema(value)
  }
}

function toSchema(def) {

  if (def.type === 'Array') {
    return new GraphQLList(toSchema(def.arrayOf))
  }

  if (stringToGraphqlSchema[def.type]) {
    return stringToGraphqlSchema[def.type]
  } else {
    return stringToGraphqlSchema[def.type] = new GraphQLObjectType({
      name: def.type, fields: toSchema(def.fieldsDefinition)
    })
  }
}

export function graphqlFrom(typesDefinitions: any[]): any {

  return typesDefinitions.map((typeDefinition) => {
    const fieldsArray = Object.keys(typeDefinition.fieldsDefinition).map(fieldName => {
      return {
        [fieldName]: toSchema(typeDefinition.fieldsDefinition[fieldName])
      }
    });

    const fields = {};
    for (let field of fieldsArray) {
      Object.assign(fields, field)
    }

    return new GraphQLObjectType({
      name: typeDefinition.name,
      fields
    })

  })
}
