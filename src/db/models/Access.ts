import mongoose from "mongoose";

import { ONE_MONTH } from "../../utils/time/constants";

import Session from "./Session";

const now = Date.now();

export const AccessSchema: mongoose.Schema = new mongoose.Schema({
  token: { type: String, required: true },
  exp: { type: Date, default: now + ONE_MONTH },
  iat: { type: Date, default: now },
  sessions: [Session.schema],
  source: String,
  deviceType: String,
});

AccessSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    const access = await mongoose.models.Access.findById(doc.id);
    access.sessions.forEach(async (session: any) => {
      await Session.findByIdAndDelete(session.id);
    });
    next();
  }
);

export default mongoose.model("Access", AccessSchema);
