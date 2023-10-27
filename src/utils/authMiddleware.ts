import express from "express";
import jwt from "jsonwebtoken";
import findValidAccess from "./findValidAccess";
import User from "src/db/models/User";
import Access from "src/db/models/Access";
import { GraphQLError } from "graphql";

const router = express.Router();

const authMiddleware = async (req: any, res: any, next: any) => {
  let referer = undefined;
  for (const id in req.rawHeaders) {
    if (req.rawHeaders[id] === "Referer") {
      referer = req.rawHeaders[parseInt(id) + 1];
      break;
    }
  }

  if (!(await authPassed(referer, req))) {
    res.status(401);
    res.json({ error: "Authentication failed.", status: 401 });
  } else {
    next();
  }
};

async function authPassed(referer: string = "", req: any) {
  const notRequired = ["authorizeUser", "createUser", ""];
  let session = undefined;
  if (referer && referer?.split) {
    referer = referer.split("0A++")[1];
    referer = referer && referer.split("%28")[0];
  }
  if ("checkers" in req.signedCookies) {
    const { accessId, userId } = jwt.decode(req.signedCookies.checkers) as any;
    const user = await User.findById(userId);
    const access = await Access.findById(accessId);
    if (user) {
      req.user = user;
      session = await findValidAccess(user, [access]);
    }
  }
  return notRequired.includes(referer) || session;
}

router.use("/graphql", authMiddleware);

export default router;
