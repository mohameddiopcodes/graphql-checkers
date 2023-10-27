import { GraphQLError } from "graphql";
import { login } from "../../../../db/controllers/Users";

export default async function authorizeUser(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await login(req, res, args);
  } catch (e: any) {
    new GraphQLError(e.message);
  }
}
