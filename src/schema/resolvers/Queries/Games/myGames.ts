import { GraphQLError } from "graphql";
import { listGames } from "../../../../db/controllers/Games";

export default async function myGames(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await listGames(req, res, args);
  } catch (e: any) {
    new GraphQLError(e.message);
  }
}
