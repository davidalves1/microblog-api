const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');

const inputPostType = new GraphQLInputObjectType({
  name: 'PostInput',
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    author: { type: GraphQLString },
  }
});

module.exports = {
  inputPostType,
}
