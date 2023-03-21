import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "http";

const yoga = createYoga({
    schema: createSchema({
        typeDefs: `
            type Query {
                hello: String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello world"
            }
        }
    })
})

const server = createServer(yoga)

server.listen(4000, () => {
    console.info('Server listening on http://localhost:4000/graphql')
})