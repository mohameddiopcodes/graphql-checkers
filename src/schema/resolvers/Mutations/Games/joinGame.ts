import { GraphQLError } from "graphql";
import { flipGameStatus } from "../../../../db/controllers/Games";

export default async function joinGame(
  parent: any,
  args: any,
  { req, res, pubsub }: any
) {
  try {
    return await flipGameStatus(req, res, args, pubsub);
  } catch (e: any) {
    throw new GraphQLError(e.message);
  }
}
