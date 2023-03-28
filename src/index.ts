import { createServer } from "http";
import { createSchema, createYoga, createPubSub } from "graphql-yoga";

import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";
import db from "./db";

const pubsub = createPubSub();

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: { db, pubsub },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server listening on http://localhost:4000/graphql");
});
