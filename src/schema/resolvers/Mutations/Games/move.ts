import { GraphQLError } from "graphql";
import { performGameLogic } from "../../../../db/controllers/Games";

export default async function move(
  parent: any,
  args: any,
  { req, res, pubsub }: any
) {
  try {
    return await performGameLogic(req, res, args, pubsub);
  } catch (e: any) {
    throw new GraphQLError(e.message);
  }
}
