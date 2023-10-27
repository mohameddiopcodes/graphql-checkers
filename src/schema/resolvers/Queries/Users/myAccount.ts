import { GraphQLError } from "graphql";
import { me } from "../../../../db/controllers/Users";

export default async function myAccount(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await me(req, res);
  } catch (e: any) {
    new GraphQLError(e.message);
  }
}
