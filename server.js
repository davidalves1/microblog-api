const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { schema } = require('./schema/post')

const app = express()

const PORT = process.env.PORT || 5000
const isDevelopment = process.env.NODE_ENV === 'development'

app.use("/graphql", graphqlHTTP({ schema, graphiql: isDevelopment }))

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}/graphql`)
})
