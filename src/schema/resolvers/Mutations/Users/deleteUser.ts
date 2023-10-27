import { GraphQLError } from "graphql";
import { del } from "../../../../db/controllers/Users";

export default async function deleteUser(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await del(req, res);
  } catch (e: any) {
    throw new GraphQLError(e.message);
  }
}
