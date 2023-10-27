import express from "express";
import { createSchema, createYoga, createPubSub } from "graphql-yoga";
import dotenv from "dotenv";

dotenv.config();

import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";

import "./db";
import cookieParser from "cookie-parser";
import authMiddleware from "./utils/authMiddleware";

const PORT = process.env.PORT;

const app = express();

app.use(cookieParser(process.env.SECRET));

app.use(authMiddleware);

const pubsub = createPubSub();

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: { pubsub },
});

app.use(yoga.graphqlEndpoint, yoga);

app.listen(PORT, () => {
  console.log(`GraphQL: http://localhost:${PORT}/graphql`);
});
