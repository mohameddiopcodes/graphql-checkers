import { GraphQLError } from "graphql";
import { update } from "../../../../db/controllers/Users";

export default async function updateUser(
  parent: any,
  args: any,
  { req, res }: any
) {
  try {
    return await update(req, res, args);
  } catch (e: any) {
    throw new GraphQLError(e.message);
  }
}
