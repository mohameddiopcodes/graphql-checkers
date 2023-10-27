import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Session from "../models/Session";
import uuid4 from "uuid4";
import Access from "../models/Access";
import { GraphQLError } from "graphql";
import { CookieParseOptions } from "cookie-parser";
import { ONE_DAY } from "src/utils/time/constants";
import findValidAccessOrCreate, {
  createAccess,
} from "src/utils/findValidAccess";

export { signup, login, users, user, me, update, del };

async function signup(req: Request, res: Response, args: any) {
  let { name, email, age, password, profilePicture } = args.user;
  const existingUser = await User.findOne({ email });

  if (existingUser) return new GraphQLError("Account already registered.");

  let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS as string));
  password = bcrypt.hashSync(password, salt);

  //create user
  const user = await User.create({
    name,
    email,
    age,
    password,
    profilePicture,
  });

  //create session token
  const session = await createAccess(user);

  res.cookie("checkers", session.token, {
    maxAge: new Date(session.iat).getTime() + ONE_DAY,
    signed: true,
    httpOnly: true,
    path: "/",
  });

  return {
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    age: user.age,
  };
}

async function login(req: any, res: any, args: any) {
  let { email, password, profilePicture } = args.user;
  let existingUser = profilePicture
    ? await User.findOneAndUpdate({ email }, { profilePicture })
    : await User.findOne({ email });

  if (!existingUser) return new GraphQLError("Please create an account.");

  if (!bcrypt.compareSync(password, existingUser.password))
    return new GraphQLError("Wrong password.");

  //is there any valid access
  let foundSession = undefined;

  foundSession = await findValidAccessOrCreate(
    existingUser,
    existingUser.accesses
  );

  res.cookie("checkers", foundSession.token, {
    maxAge: new Date(foundSession.exp).getTime(),
    signed: true,
    httpOnly: true,
    path: "/",
  });

  return {
    name: existingUser.name,
    email,
    age: existingUser,
    profilePicture: profilePicture ?? existingUser.profilePicture,
  };
}

async function users(req: Request, res: Response) {}

async function user(req: any, res: Response, args: any) {
  const { id } = args;

  const existingUser = await User.findById(id);

  if (!existingUser) return new GraphQLError("Please create an account.");

  return {
    name: existingUser.name,
    email: existingUser.email,
    profilePicture: existingUser.profilePicture,
    age: existingUser.age,
  };
}

async function me(req: any, res: Response) {
  return {
    name: req.user.name,
    email: req.user.email,
    profilePicture: req.user.profilePicture,
    age: req.user.age,
  };
}

async function update(req: any, res: Response, args: any) {
  let updates = args.user;
  Object.keys(args.user).forEach((key) => {
    req.user[key] = updates[key];
  });
  req.user.save();

  return {
    name: req.user.name,
    email: req.user.email,
    profilePicture: req.user.profilePicture,
    age: req.user.age,
  };
}

async function del(req: any, res: Response) {
  await req.user.deleteOne();

  return {
    name: req.user.name,
    email: req.user.email,
    profilePicture: req.user.profilePicture,
    age: req.user.age,
  };
}
