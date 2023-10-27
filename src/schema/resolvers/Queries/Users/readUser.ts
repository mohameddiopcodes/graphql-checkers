import { GraphQLError } from "graphql";
import { user } from "../../../../db/controllers/Users";

export default async function readUser(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await user(req, res, args);
  } catch (e: any) {
    new GraphQLError(e.message);
  }
}
