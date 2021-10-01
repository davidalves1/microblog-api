const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { inputPostType } = require('./input')

const db = new sqlite3.Database(path.resolve(__dirname, '..', '..', 'db', 'micro-blog.db'))

const createPostTable = () => {
  return db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      author TEXT NOT NULL
    );
  `)
}

createPostTable()

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    author: { type: GraphQLString },
  }
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    Posts: {
      type: GraphQLList(PostType),
      resolve(root, args, context, info) {
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM posts;', (err, rows) => {
            if (err) reject([])

            resolve(rows)
          })
        })
      }
    },
    Post: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(root, { id }) {
        return new Promise((resolve, reject) => {
          db.get('SELECT * FROM posts WHERE id = (?);', [id], (err, row) => {
            if (err) reject(null)

            resolve(row)
          })
        })
      }
    }
  }
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPost: {
      type: PostType,
      args: {
        input: { type: inputPostType }
      },
      resolve(root, { input }) {
        const { title, description, author } = input

        return new Promise((resolve, reject) => {
          db.run('INSERT INTO posts (title, description, author) VALUES (?, ?, ?);', [title, description, author], function (err) {
            if (err) reject(err)

            db.get('SELECT * FROM posts WHERE id = (?);', [this.lastID], (getError, row) => {
              if (getError) reject(null)

              resolve(row)
            })
          })
        })
      },
    }
  }
})

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
})

module.exports = { schema }
