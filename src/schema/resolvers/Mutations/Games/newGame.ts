import { GraphQLError } from "graphql";
import { createGame } from "../../../../db/controllers/Games";

export default async function newGame(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await createGame(req, res, args);
  } catch (e: any) {
    throw new GraphQLError(e.message);
  }
}
