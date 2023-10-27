import jwt from "jsonwebtoken";
import { Model } from "mongoose";
import Access from "src/db/models/Access";
import Session from "src/db/models/Session";

export async function findValidAccess(existingUser: any, accesses: Array<any>) {
  let foundSession = undefined;

  // find valid access
  if (accesses.length) {
    accesses.forEach(async (access) => {
      const accessExpired = new Date(access.exp).getTime() < Date.now();
      if (accessExpired) return Access.deleteOne({ id: access.id });

      const session = access.sessions.length
        ? access.sessions.find((session: any) => {
            const sessionExpired = new Date(session.exp).getTime() < Date.now();
            if (sessionExpired) {
              Session.deleteOne({ id: session.id });
            }
            return !sessionExpired;
          })
        : false;

      if (!accessExpired && session) {
        foundSession = session;
      } else {
        let token = jwt.sign(
          { accessId: access.id, userId: existingUser.id },
          process.env.SECRET as string
        );

        foundSession = await Session.create({
          token,
          userId: existingUser.id,
        });
      }
    });
  }

  return foundSession;
}

export async function createAccess(existingUser: any) {
  //create session token if no valid token found

  const data = {
    name: existingUser.name,
    email: existingUser.email,
  };
  //creating access
  let token = jwt.sign(data, process.env.SECRET as string);
  const access = await Access.create({ token });

  existingUser.accesses.push(access);
  await existingUser.save();
  //creating session
  token = jwt.sign(
    { accessId: access.id, userId: existingUser.id },
    process.env.SECRET as string
  );
  const session = await Session.create({
    token,
    userId: existingUser.id,
  });
  access.sessions.push(session);
  access.save();

  return session;
}

export default async function (existingUser: any, accesses: Array<any>) {
  const session = await findValidAccess(existingUser, accesses);
  return session || (await createAccess(existingUser));
}
