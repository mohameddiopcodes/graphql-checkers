import { GraphQLError } from "graphql";
import { signup } from "../../../../db/controllers/Users";

export default async function createUser(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await signup(req, res, args);
  } catch (e: any) {
    throw new GraphQLError(e.message);
  }
}
