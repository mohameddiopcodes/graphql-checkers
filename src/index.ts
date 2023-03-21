import { createYoga } from "graphql-yoga";
import { createServer } from "http";

const yoga = createYoga({})

const server = createServer(yoga)

server.listen(4000, () => {
    console.info('Server listening on http://localhost:4000/graphql')
})