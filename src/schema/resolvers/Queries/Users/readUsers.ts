import { users } from "../../../../db/controllers/Users";

export default async function readUsers(parent: any, { req, res }: any) {
  return await users(req, res);
}
